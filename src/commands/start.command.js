import { Markup } from 'telegraf';

export function registerStartCommand(bot) {
  bot.start(async ctx => {
    await ctx.reply(
      '🤖 <b>Keitaro Revenue Bot</b>\n\nОберіть кампанію 👇',
      {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard([
          [Markup.button.callback('📂 Campaigns', 'campaigns')],
        ]),
      }
    );
  });
}