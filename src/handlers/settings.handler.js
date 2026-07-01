export function registerSettingsHandlers(bot) {
  bot.action('settings', async ctx => {
    await ctx.answerCbQuery();
    await ctx.editMessageText('⚙️ Settings\n\nСкоро додамо налаштування.');
  });
}