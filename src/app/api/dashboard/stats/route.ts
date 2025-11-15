import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

type ActivityType = "POST" | "VIDEO" | "REVIEW" | "TRADER_REVIEW"

interface ActivityItem {
  id: string
  type: ActivityType
  title: string
  description: string
  createdAt: string
}

const truncateText = (value: string | null | undefined, length = 120) => {
  if (!value) return ""
  if (value.length <= length) return value
  return `${value.slice(0, length - 1)}…`
}

export async function GET() {
  try {
    let session = null
    try {
      session = await getServerSession(authOptions)
    } catch (sessionError) {
      // If session retrieval fails, return unauthorized
      console.warn("Session retrieval failed:", sessionError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!session?.user?.id || session.user.role !== "TRADER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const traderId = session.user.id

    const [
      totalPosts,
      publishedPosts,
      performancePostsCount,
      analyticsPostsCount,
      totalVideos,
      approvedPostReviewsAgg,
      approvedTraderReviewsAgg,
      pendingPostReviewsCount,
      pendingTraderReviewsCount,
      totalConversations,
      unreadMessages,
      publishedPerformancePosts,
      recentVideos,
      recentPostReviews,
      recentTraderReviews,
    ] = await Promise.all([
      prisma.performancePost.count(),
      prisma.performancePost.count({ where: { published: true } }),
      prisma.performancePost.count({ where: { type: "PERFORMANCE" } }),
      prisma.performancePost.count({ where: { type: "ANALYTICS" } }),
      prisma.tradingVideo.count(),
      prisma.review.aggregate({
        where: { status: "APPROVED" },
        _count: { _all: true },
        _sum: { rating: true },
      }),
      prisma.traderReview.aggregate({
        where: { status: "APPROVED" },
        _count: { _all: true },
        _sum: { rating: true },
      }),
      prisma.review.count({ where: { status: "PENDING" } }),
      prisma.traderReview.count({ where: { status: "PENDING" } }),
      prisma.conversation.count({ where: { traderId } }),
      prisma.message.count({
        where: {
          read: false,
          conversation: { traderId },
          senderId: { not: traderId },
        },
      }),
      prisma.performancePost.findMany({
        where: { type: "PERFORMANCE" },
        orderBy: { createdAt: "desc" },
      }),
      prisma.tradingVideo.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          title: true,
          createdAt: true,
        },
      }),
      prisma.review.findMany({
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          rating: true,
          comment: true,
          type: true,
          createdAt: true,
        },
      }),
      prisma.traderReview.findMany({
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          rating: true,
          comment: true,
          createdAt: true,
          user: {
            select: {
              username: true,
            },
          },
        },
      }),
    ])

    const approvedPostReviewsCount = approvedPostReviewsAgg._count._all ?? 0
    const approvedTraderReviewsCount = approvedTraderReviewsAgg._count._all ?? 0
    const totalReviews = approvedPostReviewsCount + approvedTraderReviewsCount

    const approvedPostRatingSum = approvedPostReviewsAgg._sum.rating ?? 0
    const approvedTraderRatingSum = approvedTraderReviewsAgg._sum.rating ?? 0
    const totalRatingSum = approvedPostRatingSum + approvedTraderRatingSum

    const averageRating = totalReviews > 0 ? totalRatingSum / totalReviews : 0
    const pendingReviews = pendingPostReviewsCount + pendingTraderReviewsCount

    const publishedPerformance = publishedPerformancePosts.filter((post) => post.published)

    const average = (values: Array<number | null | undefined>) => {
      const filtered = values.filter((value): value is number => typeof value === "number" && Number.isFinite(value))
      if (filtered.length === 0) return 0
      const sum = filtered.reduce((acc, value) => acc + value, 0)
      return sum / filtered.length
    }

    const averageWinRate = average(publishedPerformance.map((post) => post.winRate))
    const averageDrawdown = average(publishedPerformance.map((post) => post.drawdown))
    const averageRiskReward = average(publishedPerformance.map((post) => post.riskReward))
    const averageProfitLoss = average(publishedPerformance.map((post) => post.profitLoss))
    const bestProfitLoss = Math.max(
      ...publishedPerformance
        .map((post) => (typeof post.profitLoss === "number" ? post.profitLoss : Number.NEGATIVE_INFINITY)),
    )

    const topStrategies = publishedPerformance
      .slice(0, 5)
      .map((post) => ({
        id: post.id,
        title: post.title,
        profitLoss: post.profitLoss ?? null,
        winRate: post.winRate ?? null,
        drawdown: post.drawdown ?? null,
        riskReward: post.riskReward ?? null,
        createdAt: post.createdAt.toISOString(),
        published: post.published,
      }))

    const recentActivity: ActivityItem[] = []

    publishedPerformancePosts.slice(0, 5).forEach((post) => {
      recentActivity.push({
        id: post.id,
        type: "POST",
        title: post.title,
        description: `${post.published ? "Published" : "Draft"} ${post.type === "ANALYTICS" ? "analytics" : "performance"} post`,
        createdAt: post.createdAt.toISOString(),
      })
    })

    recentVideos.forEach((video) => {
      recentActivity.push({
        id: video.id,
        type: "VIDEO",
        title: video.title,
        description: "Education video uploaded",
        createdAt: video.createdAt.toISOString(),
      })
    })

    recentPostReviews.forEach((review) => {
      recentActivity.push({
        id: review.id,
        type: "REVIEW",
        title: `New ${review.type.toLowerCase()} review (${review.rating}/5)`,
        description: truncateText(review.comment, 140),
        createdAt: review.createdAt.toISOString(),
      })
    })

    recentTraderReviews.forEach((review) => {
      recentActivity.push({
        id: review.id,
        type: "TRADER_REVIEW",
        title: `Trader review (${review.rating}/5)`,
        description: truncateText(review.comment, 140) || `From ${review.user.username}`,
        createdAt: review.createdAt.toISOString(),
      })
    })

    recentActivity.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    const stats = {
      totalPosts,
      publishedPosts,
      performancePosts: performancePostsCount,
      analyticsPosts: analyticsPostsCount,
      totalVideos,
      totalReviews,
      pendingReviews,
      averageRating,
      totalConversations,
      unreadMessages,
      averageWinRate,
      averageDrawdown,
      averageRiskReward,
      averageProfitLoss,
      bestProfitLoss: Number.isFinite(bestProfitLoss) ? bestProfitLoss : null,
      topStrategies,
    }

    return NextResponse.json({
      stats,
      activity: recentActivity.slice(0, 12),
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
