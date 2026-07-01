import { bot } from './bot.js';
import { logger } from './utils/logger.js';
import { startAlertsMonitor } from './monitor/alerts.monitor.js';

try {
  await bot.telegram.deleteWebhook({ drop_pending_updates: true });

  await bot.telegram.setMyCommands([
    {
      command: 'start',
      description: 'Open main menu',
    },
    {
      command: 'id',
      description: 'Show your Telegram ID',
    },
  ]);

  startAlertsMonitor(bot);
  logger.success('Alerts monitor started');

  await bot.launch();
  logger.success('Telegram Bot started');

  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
} catch (error) {
  logger.error('Bot launch failed', error);
}