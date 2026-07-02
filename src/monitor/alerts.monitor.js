import { getAlerts, saveAlerts } from '../services/alerts.service.js';
import { getCampaignStats } from '../services/stats.service.js';

const CHECK_INTERVAL = 60_000;

let isRunning = false;

function getGeoFromCampaignName(name = '') {
  const match = name.match(/^([A-Z]{2})\s*-/);
  return match ? match[1] : '🌍';
}

async function checkAlerts(bot) {
  if (isRunning) return;

  isRunning = true;

  try {
    const alerts = await getAlerts();
    console.log('ALL ALERTS:', alerts);
    const enabledAlerts = alerts.filter(alert => alert.enabled);

    console.log('ENABLED ALERTS:', enabledAlerts.length);

    for (const alert of enabledAlerts) {
      const stats = await getCampaignStats(alert.campaignId, 'today');

      console.log('STATS:', alert.campaignId, stats);

      if (!stats) continue;

      const campaignName =
        alert.campaignName || stats.campaign || `Campaign #${alert.campaignId}`;

      const currentConversions = Number(stats.conversions || 0);
      const currentRevenue = Number(stats.sale_revenue || 0);
      const currentClicks = Number(stats.clicks || 0);

      const lastConversions = Number(alert.lastConversions || 0);
      const lastRevenue = Number(alert.lastRevenue || 0);

      if (!alert.initialized) {
        alert.lastConversions = currentConversions;
        alert.lastRevenue = currentRevenue;
        alert.initialized = true;

        console.log('ALERT INITIALIZED:', {
          campaignId: alert.campaignId,
          currentConversions,
          currentRevenue,
        });

        continue;
      }

      const diffConversions = currentConversions - lastConversions;
      const diffRevenue = currentRevenue - lastRevenue;

      console.log('ALERT CHECK:', {
        campaignId: alert.campaignId,
        campaignName,
        lastConversions,
        currentConversions,
        diffConversions,
        lastRevenue,
        currentRevenue,
        diffRevenue,
        telegramId: alert.telegramId,
      });

      if (diffRevenue > 0) {
        await bot.telegram.sendMessage(
          alert.telegramId,
          `💰 <b>${campaignName}</b> / ${diffRevenue}$ / ${stats.ts || '-'} / ${stats.group || '-'}`,
          { parse_mode: 'HTML' }
        );
      } else if (diffConversions > 0) {
        await bot.telegram.sendMessage(
          alert.telegramId,
          `🟢 <b>${campaignName}</b> / REG +${diffConversions} / ${stats.ts || '-'} / ${stats.group || '-'}`,
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
}

export function startAlertsMonitor(bot) {
  console.log('✅ Alerts monitor started');

  checkAlerts(bot);

  setInterval(() => {
    checkAlerts(bot);
  }, CHECK_INTERVAL);
}