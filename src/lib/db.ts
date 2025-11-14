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

// Determine if we're in a serverless environment (Vercel, etc.)
const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NODE_ENV === 'production'

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})f

// Only cache Prisma instance in non-serverless environments (local development)
// In serverless environments (Vercel), each function invocation should have its own instance
if (!isServerless) {
  globalForPrisma.prisma = prisma
}
