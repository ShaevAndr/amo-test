import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './src/database/drizzle',
  schema: './src/database/schema.ts',
  dialect: 'mysql',
  dbCredentials: {
    // @ts-ignore
    url: `mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  },
});