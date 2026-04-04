import dotenv from 'dotenv';
import { Bot } from 'grammy';
import mongoose from 'mongoose';

import 'dotenv/config';

dotenv.config({ path: '.env.development' });

export const DB_URL = process.env.DB_URL;
export const BOT_TOKEN = process.env.BOT_TOKEN;
export const BOT_ADMIN_ID = Number(process.env.BOT_ADMIN_ID);
export const GROUP_ID = process.env.GROUP_ID;

if (!BOT_TOKEN) throw new Error('BOT_TOKEN не встановлено');
if (!BOT_ADMIN_ID) throw new Error('BOT_ADMIN_ID не встановлено');
if (!DB_URL) throw new Error('DB_URL не встановлено');
if (!GROUP_ID) throw new Error('GROUP_ID не встановлено');

export const connectDB = async () => {
  try {
    await mongoose.connect(DB_URL);
    // eslint-disable-next-line no-console
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB error:', err);
    process.exit(1);
  }
};

export const bot = new Bot(BOT_TOKEN);
