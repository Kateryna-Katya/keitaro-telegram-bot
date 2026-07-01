import { getAlerts, saveAlerts } from '../services/alerts.service.js';
import { getCampaignStats } from '../services/stats.service.js';

const CHECK_INTERVAL = 60_000;

let isRunning = false;

function getGeoFromCampaignName(name = '') {
  const match = name.match(/^([A-Z]{2})\s*-/);
  return match ? match[1] : '🌍';
}

function formatTime() {
  return new Date().toLocaleTimeString('uk-UA', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function startAlertsMonitor(bot) {
  setInterval(async () => {
    if (isRunning) return;

    isRunning = true;

    try {
      const alerts = await getAlerts();
      const enabledAlerts = alerts.filter(alert => alert.enabled);

      for (const alert of enabledAlerts) {
        const stats = await getCampaignStats(alert.campaignId, 'today');

        if (!stats) {
          alert.lastConversions ??= 0;
          alert.lastRevenue ??= 0;
          continue;
        }

        const campaignName =
          alert.campaignName || stats.campaign || `Campaign #${alert.campaignId}`;

        const geo = getGeoFromCampaignName(campaignName);

        const currentConversions = Number(stats.conversions || 0);
        const currentRevenue = Number(stats.sale_revenue || 0);
        const currentClicks = Number(stats.clicks || 0);

        if (!alert.initialized) {
          alert.lastConversions = currentConversions;
          alert.lastRevenue = currentRevenue;
          alert.initialized = true;
          continue;
        }

        const lastConversions = Number(alert.lastConversions || 0);
        const lastRevenue = Number(alert.lastRevenue || 0);

        const diffConversions = currentConversions - lastConversions;
        const diffRevenue = currentRevenue - lastRevenue;

        if (diffRevenue > 0) {
          await bot.telegram.sendMessage(
            alert.telegramId,
            `💰 <b>${geo} ${campaignName}</b> | DEP: +${diffRevenue}$ | total: ${currentRevenue}$ | conv: ${currentConversions} | ${formatTime()}`,
            { parse_mode: 'HTML' }
          );
        } else if (diffConversions > 0) {
          await bot.telegram.sendMessage(
            alert.telegramId,
            `🟢 <b>${geo} ${campaignName}</b> | REG: +${diffConversions} | clicks: ${currentClicks} | conv: ${currentConversions} | ${formatTime()}`,
            { parse_mode: 'HTML' }
          );
        }

        alert.lastConversions = currentConversions;
        alert.lastRevenue = currentRevenue;
      }

      await saveAlerts(alerts);
    } catch (error) {
      console.error(
        'ALERTS MONITOR ERROR:',
        error.response?.data || error.message
      );
    } finally {
      isRunning = false;
    }
  }, CHECK_INTERVAL);
}