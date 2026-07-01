export function registerHelpCommand(bot) {
  bot.command('help', async ctx => {
    await ctx.reply(
      'ℹ️ <b>Допомога</b>\n\n/start — головне меню\n/id — показати ваш Telegram ID',
      { parse_mode: 'HTML' }
    );
  });
}