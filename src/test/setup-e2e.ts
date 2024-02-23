import { randomUUID } from 'crypto'
import { execSync } from 'child_process'
import { PrismaClient } from '@prisma/client'

import { DomainEvents } from '@/core/events/domain-events'

const prisma = new PrismaClient()

function generateUniqueDatabaseURL(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL env var is not set')
  }

  const dbURL = new URL(process.env.DATABASE_URL)

  dbURL.searchParams.set('schema', schemaId)

  return dbURL.toString()
}

const schemaId = randomUUID()

beforeAll(async () => {
  process.env.DATABASE_URL = generateUniqueDatabaseURL(schemaId)

  DomainEvents.shouldDispatchEvents = false

  execSync(`npx prisma migrate deploy --preview-feature`)
})

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE;`)

  await prisma.$disconnect()
})
