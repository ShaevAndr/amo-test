import { config } from 'dotenv';
import { resolve } from 'node:path';
import { existsSync } from 'node:fs';
import { z } from 'zod';

// Prefer root .env (one level above backend) if present; fallback to local backend/.env; finally default
const rootEnv = resolve(process.cwd(), '../.env');
const localEnv = resolve(process.cwd(), '.env');
if (existsSync(rootEnv)) {
  config({ path: rootEnv });
} else if (existsSync(localEnv)) {
  config({ path: localEnv });
} else {
  config();
}

const envSchema = z.object({
  PORT: z.string().default('3000'),
  DB_HOST: z.string(),
  DB_PORT: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  AMO_CLIENT_ID: z.string(),
  AMO_CLIENT_SECRET: z.string(),
  AMO_REDIRECT_URI: z.string(),
  AMO_DOMAIN: z.string(),
  AMO_ACCESS_TOKEN: z.string().optional(),
  SERVER_URL: z.string(),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
