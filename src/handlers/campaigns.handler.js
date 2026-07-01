import { Markup } from 'telegraf';
import { getCampaigns } from '../services/campaigns.service.js';

export function registerCampaignHandlers(bot) {
  bot.action('campaigns', async ctx => {
    await ctx.answerCbQuery();

    try {
      const campaigns = await getCampaigns();

      if (!campaigns.length) {
        return ctx.editMessageText('📂 Кампаній не знайдено');
      }

      const buttons = campaigns.slice(0, 20).map(campaign => [
        Markup.button.callback(
          `🟢 ${campaign.name}`,
          `campaign_${campaign.id}`
        ),
      ]);

      await ctx.editMessageText('📂 <b>Campaigns</b>\n\nОберіть кампанію:', {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard(buttons),
      });
    } catch (error) {
      console.error(error.response?.data || error.message);
      await ctx.reply('❌ Не вдалося отримати кампанії з Keitaro');
    }
  });

  bot.action(/^campaign_(\d+)$/, async ctx => {
    await ctx.answerCbQuery();

    const campaignId = ctx.match[1];

    await ctx.editMessageText(
      `📂 <b>Campaign #${campaignId}</b>\n\nОберіть дію:`,
      {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard([
          [Markup.button.callback('📊 Today', `campaign_stats_today_${campaignId}`)],
          [Markup.button.callback('📅 Yesterday', `campaign_stats_yesterday_${campaignId}`)],
          [Markup.button.callback('📈 Last 7 Days', `campaign_stats_week_${campaignId}`)],
          [Markup.button.callback('📆 Month', `campaign_stats_month_${campaignId}`)],
          [
            Markup.button.callback('🔔 Alerts ON', `alerts_on_${campaignId}`),
            Markup.button.callback('🔕 Alerts OFF', `alerts_off_${campaignId}`),
          ],
          [Markup.button.callback('⬅️ Back', 'campaigns')],
        ]),
      }
    );
  });
}