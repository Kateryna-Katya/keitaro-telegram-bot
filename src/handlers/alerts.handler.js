import {
  getAlerts,
  enableAlert,
  disableAlert,
} from '../services/alerts.service.js';

import { getCampaignById } from '../services/campaigns.service.js';

export function registerAlertsHandlers(bot) {
  bot.action('alerts', async ctx => {
    await ctx.answerCbQuery();

    const telegramId = ctx.from.id;
    const alerts = await getAlerts();

    const userAlerts = alerts.filter(
      alert => alert.telegramId === telegramId && alert.enabled
    );

    if (!userAlerts.length) {
      return ctx.editMessageText('🔔 Alerts\n\nПоки немає активних сповіщень.');
    }

    await ctx.editMessageText(
      `🔔 <b>Active alerts</b>\n\n${userAlerts
        .map(alert => `• ${alert.campaignName || `Campaign #${alert.campaignId}`}`)
        .join('\n')}`,
      { parse_mode: 'HTML' }
    );
  });

  bot.action(/^alerts_on_(\d+)$/, async ctx => {
    await ctx.answerCbQuery();

    const campaignId = ctx.match[1];
    const telegramId = ctx.from.id;

    const campaign = await getCampaignById(campaignId);

    await enableAlert({
      telegramId,
      campaignId,
      campaignName: campaign?.name || `Campaign #${campaignId}`,
    });

    await ctx.editMessageText(
      `🔔 Alerts ON\n\n📂 ${campaign?.name || `Campaign #${campaignId}`}`
    );
  });

  bot.action(/^alerts_off_(\d+)$/, async ctx => {
    await ctx.answerCbQuery();

    const campaignId = ctx.match[1];
    const telegramId = ctx.from.id;

    await disableAlert({ telegramId, campaignId });

    await ctx.editMessageText(`🔕 Alerts OFF для Campaign #${campaignId}`);
  });
}