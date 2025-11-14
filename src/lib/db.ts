import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Use Prisma Accelerate URL if available, otherwise use direct DATABASE_URL
const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error(
    'Missing DATABASE_URL or PRISMA_DATABASE_URL environment variable. ' +
    'Please set DATABASE_URL to your PostgreSQL connection string.'
  )
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
