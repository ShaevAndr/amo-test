import { drizzle } from 'drizzle-orm/mysql2';
import { env } from '../config/env';

const db_url = `mysql://${env.DB_USER}:${env.DB_PASSWORD}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`;
export const db = drizzle(db_url);
