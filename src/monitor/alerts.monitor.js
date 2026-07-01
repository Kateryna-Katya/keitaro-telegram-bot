import { getAlerts, saveAlerts } from '../services/alerts.service.js';
import { getCampaignStats } from '../services/stats.service.js';

const CHECK_INTERVAL = 60_000;

let isRunning = false;

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
          alert.lastRevenue ??= 0;
          continue;
        }

        const currentRevenue = Number(stats.sale_revenue || 0);

        // Перша синхронізація — просто запам'ятовуємо поточний Revenue
        if (!alert.initialized) {
          alert.lastRevenue = currentRevenue;
          alert.initialized = true;
          continue;
        }

        const lastRevenue = Number(alert.lastRevenue || 0);

        // Повідомляємо тільки якщо збільшився Revenue
        if (currentRevenue > lastRevenue) {
          const diffRevenue = currentRevenue - lastRevenue;

          await bot.telegram.sendMessage(
            alert.telegramId,
            `💰 <b>NEW REVENUE</b>

📂 ${alert.campaignName || `Campaign #${alert.campaignId}`}

➕ Revenue: +${diffRevenue} $

💵 Total Revenue Today: ${currentRevenue} $

🕒 ${new Date().toLocaleTimeString('uk-UA', {
              hour: '2-digit',
              minute: '2-digit',
            })}`,
            {
              parse_mode: 'HTML',
            }
          );
        }

        // Оновлюємо останній Revenue
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