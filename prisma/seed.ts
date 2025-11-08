import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function clearData() {
  await prisma.$transaction([
    prisma.message.deleteMany(),
    prisma.conversation.deleteMany(),
    prisma.traderReview.deleteMany(),
    prisma.review.deleteMany(),
    prisma.tradingVideo.deleteMany(),
    prisma.performancePost.deleteMany(),
    prisma.account.deleteMany(),
    prisma.session.deleteMany(),
    prisma.verificationToken.deleteMany(),
  ])

  await prisma.user.deleteMany()
}

async function main() {
  await clearData()

  const adminPassword = 'Admin!234'
  const adminPasswordHash = await bcrypt.hash(adminPassword, 10)

  await prisma.user.create({
    data: {
      email: 'admin@trading-performance.com',
      username: 'lead-trader',
      role: 'TRADER',
      passwordHash: adminPasswordHash,
    },
  })

  console.log('Database cleaned. Admin account ready:')
  console.log('  Email: admin@trading-performance.com')
  console.log('  Password:', adminPassword)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
