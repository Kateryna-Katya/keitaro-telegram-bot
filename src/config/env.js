import dotenv from 'dotenv';

dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',

  telegram: {
    token: process.env.TELEGRAM_BOT_TOKEN,
    ownerId: Number(process.env.OWNER_ID),
    admins: process.env.ADMINS
      ? process.env.ADMINS.split(',').map(Number)
      : [],
  },

  keitaro: {
    baseUrl: process.env.KEITARO_BASE_URL,
    apiKey: process.env.KEITARO_API_KEY,
  },
};