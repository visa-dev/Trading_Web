import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

const formatAverage = (values: Array<number | null | undefined>) => {
  const filtered = values.filter((value): value is number => typeof value === "number" && Number.isFinite(value))
  if (filtered.length === 0) return 0
  const sum = filtered.reduce((total, current) => total + current, 0)
  return sum / filtered.length
}

const isMissingBioColumnError = (error: unknown) => {
  if (!(error instanceof Error)) return false
  return error.message.includes("User.bio")
}

type TraderRecord = {
  id: string
  username: string
  email: string
  image: string | null
  createdAt: Date
  bio?: string | null
}

export async function GET() {
  try {
    let trader: TraderRecord | null = null
    let traderBio = ""

    try {
      const traderWithBio = await prisma.user.findFirst({
        where: { role: "TRADER" },
        select: {
          id: true,
          username: true,
          email: true,
          image: true,
          bio: true,
          createdAt: true,
        },
      })
      trader = traderWithBio
      traderBio = traderWithBio?.bio ?? ""
    } catch (error) {
      if (isMissingBioColumnError(error)) {
        const traderWithoutBio = await prisma.user.findFirst({
          where: { role: "TRADER" },
          select: {
            id: true,
            username: true,
            email: true,
            image: true,
            createdAt: true,
          },
        })
        trader = traderWithoutBio
      } else {
        throw error
      }
    }

    if (!trader) {
      return NextResponse.json({ error: "Trader profile not found" }, { status: 404 })
    }

    const [
      performancePosts,
      analyticsPosts,
      traderReviewsAgg,
      totalTraderReviews,
      totalPerformancePosts,
      totalAnalyticsPosts,
      totalVideos,
    ] = await Promise.all([
      prisma.performancePost.findMany({
        where: { type: "PERFORMANCE", published: true },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          profitLoss: true,
          winRate: true,
          drawdown: true,
          riskReward: true,
          createdAt: true,
          published: true,
        },
      }),
      prisma.performancePost.findMany({
        where: { type: "ANALYTICS", published: true },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          createdAt: true,
        },
      }),
      prisma.traderReview.aggregate({
        where: { traderId: trader.id, status: "APPROVED" },
        _sum: { rating: true },
      }),
      prisma.traderReview.count({
        where: { traderId: trader.id, status: "APPROVED" },
      }),
      prisma.performancePost.count({ where: { type: "PERFORMANCE" } }),
      prisma.performancePost.count({ where: { type: "ANALYTICS" } }),
      prisma.tradingVideo.count(),
    ])

    const averageTraderRating =
      totalTraderReviews > 0 && typeof traderReviewsAgg._sum.rating === "number"
        ? traderReviewsAgg._sum.rating / totalTraderReviews
        : 0

    const averageWinRate = formatAverage(performancePosts.map((post) => post.winRate))
    const averageDrawdown = formatAverage(performancePosts.map((post) => post.drawdown))
    const averageRiskReward = formatAverage(performancePosts.map((post) => post.riskReward))
    const averageProfitLoss = formatAverage(performancePosts.map((post) => post.profitLoss))

    const topStrategies = performancePosts.slice(0, 3)

    return NextResponse.json({
      trader: {
        id: trader.id,
        name: trader.username,
        bio: traderBio,
        image: trader.image,
        createdAt: trader.createdAt.toISOString(),
      },
      stats: {
        totalPerformancePosts,
        totalAnalyticsPosts,
        totalVideos,
        totalTraderReviews,
        averageTraderRating,
        averageWinRate,
        averageDrawdown,
        averageRiskReward,
        averageProfitLoss,
      },
      topStrategies: topStrategies.map((strategy) => ({
        id: strategy.id,
        title: strategy.title,
        profitLoss: strategy.profitLoss,
        winRate: strategy.winRate,
        drawdown: strategy.drawdown,
        riskReward: strategy.riskReward,
        createdAt: strategy.createdAt.toISOString(),
      })),
      analyticsHighlights: analyticsPosts.slice(0, 3).map((post) => ({
        id: post.id,
        title: post.title,
        createdAt: post.createdAt.toISOString(),
      })),
    })
  } catch (error) {
    console.error("Error fetching trader profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

