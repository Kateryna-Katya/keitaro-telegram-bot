import { Markup } from 'telegraf';
import { getCampaignStats } from '../services/stats.service.js';
import { formatCampaignStats } from '../utils/formatStats.js';

export function registerStatsHandlers(bot) {
  bot.action('stats', async ctx => {
    await ctx.answerCbQuery();
    await ctx.editMessageText('📊 Statistics\n\nОберіть кампанію через меню Campaigns.');
  });

bot.action(/^campaign_stats_(today|yesterday|week|month)_(\d+)$/, async ctx => {
  await ctx.answerCbQuery();

  const period = ctx.match[1];
  const campaignId = ctx.match[2];

  try {
    const stats = await getCampaignStats(campaignId, period);

    if (!stats) {
      return ctx.editMessageText(
        `📊 Campaign #${campaignId}\n\nДаних за цей період немає.`,
        {
          ...Markup.inlineKeyboard([
            [Markup.button.callback('⬅️ Back', `campaign_${campaignId}`)],
          ]),
        }
      );
    }

await ctx.editMessageText(
  formatCampaignStats({ campaignId, period, stats }),
  {
    parse_mode: 'HTML',
    ...Markup.inlineKeyboard([
      [
        Markup.button.callback('📊 Today', `campaign_stats_today_${campaignId}`),
        Markup.button.callback('📅 Yesterday', `campaign_stats_yesterday_${campaignId}`),
      ],
      [
        Markup.button.callback('📈 7 Days', `campaign_stats_week_${campaignId}`),
        Markup.button.callback('📆 Month', `campaign_stats_month_${campaignId}`),
      ],
      [Markup.button.callback('⬅️ Back', `campaign_${campaignId}`)],
    ]),
  }
);
  } catch (error) {
    console.error(error.response?.data || error.message);
    await ctx.reply('❌ Не вдалося отримати статистику');
  }
});
}