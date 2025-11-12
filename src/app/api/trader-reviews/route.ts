import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

// GET - Fetch all trader reviews
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const traderId = searchParams.get("traderId")
    const status = searchParams.get("status")

    const where: Record<string, unknown> = {}
    
    if (traderId) {
      where.traderId = traderId
    }
    
    if (status) {
      where.status = status
    }

    const reviews = await prisma.traderReview.findMany({
      where,
      include: {
        user: {
          select: {
            username: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ reviews })
  } catch (error) {
    console.error("Error fetching trader reviews:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Create a new trader review
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the first TRADER role user from the database
    const trader = await prisma.user.findFirst({
      where: { role: "TRADER" },
      select: { id: true },
    })

    if (!trader) {
      return NextResponse.json({ error: "Trader not found" }, { status: 404 })
    }

    const traderId = trader.id

    const body = await request.json()
    const { rating, comment } = body

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Invalid rating. Must be between 1 and 5" }, { status: 400 })
    }

    if (!comment || comment.trim().length < 20) {
      return NextResponse.json({ error: "Comment must be at least 20 characters" }, { status: 400 })
    }

    // Create the review (users can add multiple reviews, needs approval)
    const review = await prisma.traderReview.create({
      data: {
        userId: session.user.id,
        traderId,
        rating,
        comment: comment.trim(),
        status: "PENDING",
      },
      include: {
        user: {
          select: {
            username: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json({ success: true, review, message: "Your review will be added shortly." }, { status: 201 })
  } catch (error) {
    console.error("Error creating trader review:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

