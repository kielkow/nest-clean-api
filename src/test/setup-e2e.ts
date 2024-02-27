import { randomUUID } from 'crypto'
import { execSync } from 'child_process'

import { Redis } from 'ioredis'
import { PrismaClient } from '@prisma/client'

import { DomainEvents } from '@/core/events/domain-events'

import { envSchema } from '@/infra/env'

const env = envSchema.parse(process.env)

const prisma = new PrismaClient()
const redis = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD,
  db: 1,
})

function generateUniqueDatabaseURL(schemaId: string) {
  if (!env.DATABASE_URL) {
    throw new Error('DATABASE_URL env var is not set')
  }

  const dbURL = new URL(env.DATABASE_URL)

  dbURL.searchParams.set('schema', schemaId)

  return dbURL.toString()
}

const schemaId = randomUUID()

beforeAll(async () => {
  env.DATABASE_URL = generateUniqueDatabaseURL(schemaId)

  DomainEvents.shouldDispatchEvents = false

  await redis.flushdb()

  execSync(`npx prisma migrate deploy --preview-feature`)
})

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE;`)

  await prisma.$disconnect()
})
