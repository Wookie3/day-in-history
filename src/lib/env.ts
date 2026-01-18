import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    WIKIPEDIA_API_URL: z.string().url().default('https://en.wikipedia.org/api/rest_v1'),
    WIKIPEDIA_API_USER_AGENT: z.string().min(1).default('ChronosDashboard/1.0 (https://localhost:3000; contact@example.com)'),
    REDIS_URL: z.string().url().optional(),
    REDIS_TOKEN: z.string().optional(),
    SENTRY_DSN: z.string().url().optional(),
    LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    WIKIPEDIA_API_URL: process.env.WIKIPEDIA_API_URL,
    WIKIPEDIA_API_USER_AGENT: process.env.WIKIPEDIA_API_USER_AGENT,
    REDIS_URL: process.env.REDIS_URL,
    REDIS_TOKEN: process.env.REDIS_TOKEN,
    SENTRY_DSN: process.env.SENTRY_DSN,
    LOG_LEVEL: process.env.LOG_LEVEL,
  },
  emptyStringAsUndefined: true,
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
