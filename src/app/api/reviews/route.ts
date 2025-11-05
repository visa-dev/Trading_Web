import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { postId, videoId, rating, comment, type } = body

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Invalid rating" }, { status: 400 })
    }

    if (type !== "POST" && type !== "VIDEO") {
      return NextResponse.json({ error: "Invalid review type" }, { status: 400 })
    }

    if (type === "POST" && !postId) {
      return NextResponse.json({ error: "Post ID required for POST reviews" }, { status: 400 })
    }

    if (type === "VIDEO" && !videoId) {
      return NextResponse.json({ error: "Video ID required for VIDEO reviews" }, { status: 400 })
    }

    // Check if user already reviewed this item
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: session.user.id,
        ...(type === "POST" ? { postId } : { videoId }),
        type,
      },
    })

    if (existingReview) {
      return NextResponse.json({ error: "You have already reviewed this item" }, { status: 400 })
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        userId: session.user.id,
        postId: type === "POST" ? postId : null,
        videoId: type === "VIDEO" ? videoId : null,
        rating,
        comment: comment || null,
        type,
        status: "PENDING", // Reviews need approval
      },
    })

    return NextResponse.json({ success: true, review }, { status: 201 })
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const type = searchParams.get("type")
    const status = searchParams.get("status") // Add status filter

    const where: Record<string, unknown> = {}
    
    if (userId) {
      where.userId = userId
    }
    
    if (type && (type === "POST" || type === "VIDEO")) {
      where.type = type
    }

    // Filter by status if provided, otherwise get all reviews
    if (status) {
      where.status = status
    }

    const reviews = await prisma.review.findMany({
      where,
      include: {
        user: {
          select: {
            username: true,
            image: true,
          },
        },
        post: {
          select: {
            title: true,
          },
        },
        video: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ reviews })
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
