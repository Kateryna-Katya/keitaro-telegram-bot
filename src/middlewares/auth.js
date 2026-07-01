import { config } from '../config/env.js';

export function authMiddleware(ctx, next) {
  const userId = ctx.from?.id;

  const allowedUsers = [
    config.telegram.ownerId,
    ...config.telegram.admins,
  ].filter(Boolean);

  if (!allowedUsers.includes(userId)) {
    return ctx.reply(  '🔒 Доступ до бота обмежений.\n\nЯкщо вам потрібен доступ, зверніться до адміністратора.');
  }

  return next();
}