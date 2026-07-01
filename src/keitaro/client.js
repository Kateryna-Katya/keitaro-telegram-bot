import axios from 'axios';
import { config } from '../config/env.js';

export const keitaroClient = axios.create({
  baseURL: `${config.keitaro.baseUrl}/admin_api/v1`,
  headers: {
    'Api-Key': config.keitaro.apiKey,
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});