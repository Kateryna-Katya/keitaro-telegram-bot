export function registerIdCommand(bot) {
  bot.command('id', async ctx => {
    await ctx.reply(`🆔 Ваш Telegram ID:\n<code>${ctx.from.id}</code>`, {
      parse_mode: 'HTML',
    });
  });
}