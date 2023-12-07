import { z } from 'zod'

export const envSchema = z.object({
  PORT: z.coerce.number().default(3333),

  JWT_SECRET: z.string().default('secret'),
  JWT_EXPIRES_IN: z.string().default('1d'),

  DATABASE_URL: z
    .string()
    .url()
    .default(
      'postgresql://postgresql:postgresql@localhost:5432/nestcleanapi?schema=public',
    ),
})

export type Env = z.infer<typeof envSchema>
