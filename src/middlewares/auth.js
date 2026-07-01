import { config } from '../config/env.js';

export function authMiddleware(ctx, next) {
  const messageText = ctx.message?.text;

  if (messageText === '/id') {
    return next();
  }

  const userId = ctx.from?.id;

  const allowedUsers = [
    config.telegram.ownerId,
    ...config.telegram.admins,
  ].filter(Boolean);

  if (!allowedUsers.includes(userId)) {
    return ctx.reply(
      '🔒 Доступ до бота обмежений.\n\nЗверніться до адміністратора.'
    );
  }

  return next();
}