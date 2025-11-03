import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create demo users
  const trader = await prisma.user.upsert({
    where: { email: 'trader@performance.com' },
    update: {},
    create: {
      email: 'trader@performance.com',
      username: 'ProfessionalTrader',
      role: 'TRADER',
    },
  })

  const user = await prisma.user.upsert({
    where: { email: 'user@test.com' },
    update: {},
    create: {
      email: 'user@test.com',
      username: 'TestUser',
      role: 'USER',
    },
  })

  // Create sample performance posts
  const post1 = await prisma.performancePost.create({
    data: {
      title: 'Q4 2024 Trading Performance - 45% Returns',
      description: 'Exceptional quarter with consistent gains across multiple strategies. Focused on momentum trading and risk management principles. Key highlights include successful EUR/USD trades and profitable commodity positions.',
      profitLoss: 15750.00,
      winRate: 78.5,
      drawdown: 8.2,
      riskReward: 2.1,
      imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop',
      published: true,
    },
  })

  const post2 = await prisma.performancePost.create({
    data: {
      title: 'Forex Scalping Strategy Results - November 2024',
      description: 'High-frequency trading approach with tight risk controls. Focused on major currency pairs during London and New York sessions. Achieved consistent daily profits with minimal drawdown.',
      profitLoss: 8920.00,
      winRate: 82.3,
      drawdown: 5.1,
      riskReward: 1.8,
      imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&h=600&fit=crop',
      published: true,
    },
  })

  const post3 = await prisma.performancePost.create({
    data: {
      title: 'Stock Market Swing Trading - October Analysis',
      description: 'Medium-term position trading in tech stocks and blue-chip companies. Utilized fundamental analysis combined with technical indicators for entry and exit points.',
      profitLoss: 12300.00,
      winRate: 71.2,
      drawdown: 12.8,
      riskReward: 2.4,
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
      published: true,
    },
  })

  // Create sample trading videos
  const video1 = await prisma.tradingVideo.create({
    data: {
      title: 'Live Trading Session - EUR/USD Breakout Strategy',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      description: 'Real-time trading session demonstrating breakout strategy on EUR/USD. Covers entry criteria, risk management, and exit strategies.',
      performanceMetrics: JSON.stringify({
        winRate: '75%',
        averageProfit: '$120 per trade',
        maxDrawdown: '3.2%',
        tradesExecuted: 15
      }),
    },
  })

  const video2 = await prisma.tradingVideo.create({
    data: {
      title: 'Technical Analysis Deep Dive - Support & Resistance',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      description: 'Comprehensive analysis of support and resistance levels in major currency pairs. Includes backtesting results and practical application tips.',
      performanceMetrics: JSON.stringify({
        accuracy: '68%',
        riskReward: '1:2.5',
        timeframe: '4H charts',
        pairsAnalyzed: 8
      }),
    },
  })

  // Create sample reviews
  await prisma.review.createMany({
    data: [
      {
        userId: user.id,
        postId: post1.id,
        rating: 5,
        comment: 'Excellent analysis! The risk management approach is impressive.',
        type: 'POST',
        status: 'APPROVED',
      },
      {
        userId: user.id,
        postId: post2.id,
        rating: 4,
        comment: 'Great scalping strategy. Would love to see more details on entry timing.',
        type: 'POST',
        status: 'APPROVED',
      },
      {
        userId: user.id,
        videoId: video1.id,
        rating: 5,
        comment: 'Very educational live session. Learned a lot about breakout trading.',
        type: 'VIDEO',
        status: 'APPROVED',
      },
    ],
  })

  // Create sample conversation
  const conversation = await prisma.conversation.create({
    data: {
      userId: user.id,
      traderId: trader.id,
      lastMessage: 'Hi, I have a question about your trading strategy.',
      unreadCount: 1,
    },
  })

  // Create sample messages
  await prisma.message.createMany({
    data: [
      {
        conversationId: conversation.id,
        senderId: user.id,
        content: 'Hi, I have a question about your trading strategy.',
        read: true,
      },
      {
        conversationId: conversation.id,
        senderId: trader.id,
        content: 'Hello! I\'d be happy to help. What would you like to know?',
        read: false,
      },
    ],
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
