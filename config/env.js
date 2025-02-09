import { config } from 'dotenv';

config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const PORT = process.env.PORT || 3000;
export const DB_HOST = process.env.DB_HOST || 'localhost';
export const DB_USER = process.env.DB_USER || 'root';
export const DB_PASSWORD = process.env.DB_PASSWORD || 'Joel@2024';
export const DB_NAME = process.env.DB_NAME || 'subscription_tracker';
export const { NODE_ENV, DB_URI, JWT_SECRET, JWT_ESPIRES_IN, } = process.env;



