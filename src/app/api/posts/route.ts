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
      published = false 
    } = body

    // Validate required fields
    if (!title || !description || profitLoss === undefined || winRate === undefined || drawdown === undefined || riskReward === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate numeric values
    if (typeof profitLoss !== "number" || typeof winRate !== "number" || typeof drawdown !== "number" || typeof riskReward !== "number") {
      return NextResponse.json({ error: "Invalid numeric values" }, { status: 400 })
    }

    if (winRate < 0 || winRate > 100 || drawdown < 0 || drawdown > 100 || riskReward < 0) {
      return NextResponse.json({ error: "Invalid metric values" }, { status: 400 })
    }

    const post = await prisma.performancePost.create({
      data: {
        title,
        description,
        profitLoss,
        winRate,
        drawdown,
        riskReward,
        imageUrl: imageUrl || null,
        videoUrl: videoUrl || null,
        published: Boolean(published)
      }
    })

    return NextResponse.json({ post }, { status: 201 })
  } catch (error) {
    console.error("Error creating post:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
