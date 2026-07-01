import { Telegraf } from 'telegraf';
import { config } from './config/env.js';
import { authMiddleware } from './middlewares/auth.js';

import { registerStartCommand } from './commands/start.command.js';
import { registerIdCommand } from './commands/id.command.js';
import { registerHelpCommand } from './commands/help.command.js';

import { registerCampaignHandlers } from './handlers/campaigns.handler.js';
import { registerStatsHandlers } from './handlers/stats.handler.js';
import { registerAlertsHandlers } from './handlers/alerts.handler.js';
import { registerSettingsHandlers } from './handlers/settings.handler.js';

export const bot = new Telegraf(config.telegram.token);

registerIdCommand(bot); // /id доступна всім

bot.use(authMiddleware);

registerStartCommand(bot);
registerHelpCommand(bot);

registerStatsHandlers(bot);
registerCampaignHandlers(bot);
registerAlertsHandlers(bot);
registerSettingsHandlers(bot);