import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)
    const published = searchParams.get("published")

    const where: { published?: boolean } = {}
    
    // If user is not authenticated or not a trader, only show published posts
    if (!session?.user?.id || session.user.role !== "TRADER") {
      where.published = true
    } else if (published !== null) {
      // If trader is requesting specific published status
      where.published = published === "true"
    }

    const posts = await prisma.performancePost.findMany({
      where,
      include: {
        reviews: {
          where: {
            status: "APPROVED"
          },
          select: {
            rating: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ posts })
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "TRADER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      title,
      description,
      profitLoss,
      winRate,
      drawdown,
      riskReward,
      imageUrl,
      videoUrl,
      published = false,
    } = body ?? {}

    const normalizeOptionalString = (value: unknown) => {
      if (typeof value !== "string") return null
      const trimmed = value.trim()
      return trimmed.length > 0 ? trimmed : null
    }

    const normalizedTitle = typeof title === "string" ? title.trim() : ""

    if (!normalizedTitle) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    const parseOptionalNumber = (value: unknown): number | null => {
      if (value === null || value === undefined || value === "") return null
      const numeric = typeof value === "number" ? value : Number(value)
      if (!Number.isFinite(numeric)) {
        throw new Error("invalid number")
      }
      return numeric
    }

    let normalizedProfitLoss: number | null
    let normalizedWinRate: number | null
    let normalizedDrawdown: number | null
    let normalizedRiskReward: number | null

    try {
      normalizedProfitLoss = parseOptionalNumber(profitLoss)
      normalizedWinRate = parseOptionalNumber(winRate)
      normalizedDrawdown = parseOptionalNumber(drawdown)
      normalizedRiskReward = parseOptionalNumber(riskReward)
    } catch {
      return NextResponse.json({ error: "Invalid numeric values" }, { status: 400 })
    }

    if (normalizedWinRate !== null && (normalizedWinRate < 0 || normalizedWinRate > 100)) {
      return NextResponse.json({ error: "Win rate must be between 0 and 100" }, { status: 400 })
    }

    if (normalizedDrawdown !== null && (normalizedDrawdown < 0 || normalizedDrawdown > 100)) {
      return NextResponse.json({ error: "Drawdown must be between 0 and 100" }, { status: 400 })
    }

    if (normalizedRiskReward !== null && normalizedRiskReward < 0) {
      return NextResponse.json({ error: "Risk/Reward must be zero or greater" }, { status: 400 })
    }

    const post = await prisma.performancePost.create({
      data: {
        title: normalizedTitle,
        description: normalizeOptionalString(description),
        profitLoss: normalizedProfitLoss,
        winRate: normalizedWinRate,
        drawdown: normalizedDrawdown,
        riskReward: normalizedRiskReward,
        imageUrl: normalizeOptionalString(imageUrl),
        videoUrl: normalizeOptionalString(videoUrl),
        published: Boolean(published),
      }
    })

    return NextResponse.json({ post }, { status: 201 })
  } catch (error) {
    console.error("Error creating post:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
