import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params
    const { id } = params

    const post = await prisma.performancePost.findUnique({
      where: {
        id,
        published: true
      },
      include: {
        reviews: {
          where: {
            status: "APPROVED"
          },
          include: {
            user: {
              select: {
                username: true,
                image: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    return NextResponse.json({ post })
  } catch (error) {
    console.error("Error fetching post:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "TRADER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const params = await context.params
    const { id } = params
    const body = await request.json()

    // Check if post exists
    const existingPost = await prisma.performancePost.findUnique({
      where: { id },
      select: { id: true, type: true }
    })

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    const normalizeOptionalString = (value: unknown) => {
      if (typeof value !== "string") return null
      const trimmed = value.trim()
      return trimmed.length > 0 ? trimmed : null
    }

    const parseOptionalNumber = (value: unknown): number | null => {
      if (value === null || value === undefined || value === "") return null
      const numeric = typeof value === "number" ? value : Number(value)
      if (!Number.isFinite(numeric)) {
        throw new Error("invalid number")
      }
      return numeric
    }

    const {
      title,
      description,
      profitLoss,
      winRate,
      drawdown,
      riskReward,
      imageUrl,
      videoUrl,
      tradingViewLink,
      published,
      type: rawType,
    } = body ?? {}

    const updateData: Record<string, unknown> = {}

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return NextResponse.json({ error: "Title is required" }, { status: 400 })
      }
      const trimmedTitle = title.trim()
      if (trimmedTitle.length > 200) {
        return NextResponse.json({ error: "Title must be less than 200 characters" }, { status: 400 })
      }
      updateData.title = trimmedTitle
    }

    if (description !== undefined) {
      const normalized = normalizeOptionalString(description)
      if (normalized && normalized.length > 10000) {
        return NextResponse.json({ error: "Description must be less than 10000 characters" }, { status: 400 })
      }
      updateData.description = normalized
    }

    if (imageUrl !== undefined) {
      updateData.imageUrl = normalizeOptionalString(imageUrl)
    }

    if (videoUrl !== undefined) {
      updateData.videoUrl = normalizeOptionalString(videoUrl)
    }

    if (published !== undefined) {
      updateData.published = Boolean(published)
    }

    if( tradingViewLink !== undefined) {
      updateData.tradingViewLink = normalizeOptionalString(tradingViewLink)
    }

    let normalizedType: "PERFORMANCE" | "ANALYTICS" | undefined

    if (rawType !== undefined) {
      if (rawType === "PERFORMANCE" || rawType === "ANALYTICS") {
        normalizedType = rawType
        updateData.type = normalizedType
      } else {
        return NextResponse.json({ error: "Invalid post type" }, { status: 400 })
      }
    }

    const targetType = normalizedType ?? existingPost.type

    if (targetType === "PERFORMANCE") {
      try {
        if (profitLoss !== undefined) {
          updateData.profitLoss = parseOptionalNumber(profitLoss)
        }
        if (winRate !== undefined) {
          const parsedWinRate = parseOptionalNumber(winRate)
          if (parsedWinRate !== null && (parsedWinRate < 0 || parsedWinRate > 100)) {
            return NextResponse.json({ error: "Win rate must be between 0 and 100" }, { status: 400 })
          }
          updateData.winRate = parsedWinRate
        }
        if (drawdown !== undefined) {
          const parsedDrawdown = parseOptionalNumber(drawdown)
          if (parsedDrawdown !== null && (parsedDrawdown < 0 || parsedDrawdown > 100)) {
            return NextResponse.json({ error: "Drawdown must be between 0 and 100" }, { status: 400 })
          }
          updateData.drawdown = parsedDrawdown
        }
        if (riskReward !== undefined) {
          const parsedRiskReward = parseOptionalNumber(riskReward)
          if (parsedRiskReward !== null && parsedRiskReward < 0) {
            return NextResponse.json({ error: "Risk/Reward must be zero or greater" }, { status: 400 })
          }
          updateData.riskReward = parsedRiskReward
        }
      } catch {
        return NextResponse.json({ error: "Invalid numeric values" }, { status: 400 })
      }
    } else {
      updateData.profitLoss = null
      updateData.winRate = null
      updateData.drawdown = null
      updateData.riskReward = null
    }

    // Update the post
    const post = await prisma.performancePost.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({ post })
  } catch (error) {
    console.error("Error updating post:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "TRADER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const params = await context.params
    const { id } = params

    // Check if post exists
    const existingPost = await prisma.performancePost.findUnique({
      where: { id },
      select: { id: true }
    })

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Delete the post (this will cascade delete reviews)
    await prisma.performancePost.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting post:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
