import { z } from 'zod'

export const envSchema = z.object({
  PORT: z.coerce.number().default(3333),

  JWT_SECRET: z.string().default('secret'),
  JWT_EXPIRES_IN: z.string().default('1d'),
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),

  DATABASE_URL: z
    .string()
    .url()
    .default(
      'postgresql://postgresql:postgresql@localhost:5432/nestcleanapi?schema=public',
    ),

  STORAGE_TYPE: z.enum(['local', 's3']).default('local'),
  STORAGE_LOCAL_PATH: z.string().default('./tmp'),
  STORAGE_S3_BUCKET: z.string().default('nestcleanapi'),
  STORAGE_S3_REGION: z.string().default('us-east-1'),
  STORAGE_S3_ACCESS_KEY_ID: z.string(),
  STORAGE_S3_SECRET_ACCESS_KEY: z.string(),
  STORAGE_CLOUDFLARE_ID: z.string(),

  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_PASSWORD: z.string().default(''),
  REDIS_DB: z.coerce.number().default(0),
})

export type Env = z.infer<typeof envSchema>
