import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testConnection() {
  try {
    console.log('🔄 Testing Prisma PostgreSQL connection...')
    
    // Test 1: Basic connection
    await prisma.$connect()
    console.log('✅ Database connection successful!')
    
    // Test 2: Query users table
    const userCount = await prisma.user.count()
    console.log(`✅ User table accessible! Total users: ${userCount}`)
    
    // Test 3: Query posts table
    const postCount = await prisma.performancePost.count()
    console.log(`✅ Posts table accessible! Total posts: ${postCount}`)
    
    // Test 4: Query videos table
    const videoCount = await prisma.tradingVideo.count()
    console.log(`✅ Videos table accessible! Total videos: ${videoCount}`)
    
    // Test 5: Fetch some data
    const posts = await prisma.performancePost.findMany({
      take: 3,
      select: {
        id: true,
        title: true,
        profitLoss: true,
        published: true
      }
    })
    console.log(`✅ Sample posts fetched:`, posts)
    
    // Test 6: Check database info
    const dbInfo = await prisma.$queryRaw`SELECT version()`
    console.log(`✅ Database version:`, dbInfo)
    
    console.log('\n🎉 All database tests passed successfully!')
    console.log('✅ Your Prisma PostgreSQL connection is working perfectly!')
    
  } catch (error) {
    console.error('❌ Database connection failed!')
    console.error('Error details:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()

