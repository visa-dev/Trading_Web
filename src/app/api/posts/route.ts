import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    let session = null
    try {
      session = await getServerSession(authOptions)
    } catch (sessionError) {
      // If session retrieval fails, treat as unauthenticated
      console.warn("Session retrieval failed, treating as unauthenticated:", sessionError)
    }
    
    const { searchParams } = new URL(request.url)
    const published = searchParams.get("published")
    const typeParam = searchParams.get("type")

    const where: { published?: boolean; type?: "PERFORMANCE" | "ANALYTICS" } = {}
    
    // If user is not authenticated or not a trader, only show published posts
    if (!session?.user?.id || session.user.role !== "TRADER") {
      where.published = true
    } else if (published !== null) {
      // If trader is requesting specific published status
      where.published = published === "true"
    }

    if (typeParam === "PERFORMANCE" || typeParam === "ANALYTICS") {
      where.type = typeParam
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
      type: rawType = "PERFORMANCE",
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

    // Limit title length
    if (normalizedTitle.length > 200) {
      return NextResponse.json({ error: "Title must be less than 200 characters" }, { status: 400 })
    }

    // Limit description length
    if (description && typeof description === "string" && description.length > 10000) {
      return NextResponse.json({ error: "Description must be less than 10000 characters" }, { status: 400 })
    }

    const parseOptionalNumber = (value: unknown): number | null => {
      if (value === null || value === undefined || value === "") return null
      const numeric = typeof value === "number" ? value : Number(value)
      if (!Number.isFinite(numeric)) {
        throw new Error("invalid number")
      }
      return numeric
    }

    const normalizedType: "PERFORMANCE" | "ANALYTICS" =
      rawType === "ANALYTICS" ? "ANALYTICS" : "PERFORMANCE"

    let normalizedProfitLoss: number | null = null
    let normalizedWinRate: number | null = null
    let normalizedDrawdown: number | null = null
    let normalizedRiskReward: number | null = null

    if (normalizedType === "PERFORMANCE") {
      try {
        normalizedProfitLoss = parseOptionalNumber(profitLoss)
        normalizedWinRate = parseOptionalNumber(winRate)
        normalizedDrawdown = parseOptionalNumber(drawdown)
        normalizedRiskReward = parseOptionalNumber(riskReward)
      } catch {
        return NextResponse.json({ error: "Invalid numeric values" }, { status: 400 })
      }
    }

    if (normalizedType === "PERFORMANCE" && normalizedWinRate !== null && (normalizedWinRate < 0 || normalizedWinRate > 100)) {
      return NextResponse.json({ error: "Win rate must be between 0 and 100" }, { status: 400 })
    }

    if (normalizedType === "PERFORMANCE" && normalizedDrawdown !== null && (normalizedDrawdown < 0 || normalizedDrawdown > 100)) {
      return NextResponse.json({ error: "Drawdown must be between 0 and 100" }, { status: 400 })
    }

    if (normalizedType === "PERFORMANCE" && normalizedRiskReward !== null && normalizedRiskReward < 0) {
      return NextResponse.json({ error: "Risk/Reward must be zero or greater" }, { status: 400 })
    }

    const post = await prisma.performancePost.create({
      data: {
        title: normalizedTitle,
        description: normalizeOptionalString(description),
        type: normalizedType,
        profitLoss: normalizedType === "PERFORMANCE" ? normalizedProfitLoss : null,
        winRate: normalizedType === "PERFORMANCE" ? normalizedWinRate : null,
        drawdown: normalizedType === "PERFORMANCE" ? normalizedDrawdown : null,
        riskReward: normalizedType === "PERFORMANCE" ? normalizedRiskReward : null,
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
