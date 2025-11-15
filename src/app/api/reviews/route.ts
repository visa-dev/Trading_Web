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

    // Validate rating
    if (!rating || typeof rating !== "number" || rating < 1 || rating > 5 || !Number.isInteger(rating)) {
      return NextResponse.json({ error: "Invalid rating" }, { status: 400 })
    }

    // Validate type
    if (type !== "POST" && type !== "VIDEO") {
      return NextResponse.json({ error: "Invalid review type" }, { status: 400 })
    }

    // Validate IDs format (should be strings, not empty)
    if (type === "POST") {
      if (!postId || typeof postId !== "string" || postId.trim().length === 0) {
        return NextResponse.json({ error: "Post ID required for POST reviews" }, { status: 400 })
      }
    } else {
      if (!videoId || typeof videoId !== "string" || videoId.trim().length === 0) {
        return NextResponse.json({ error: "Video ID required for VIDEO reviews" }, { status: 400 })
      }
    }

    // Validate comment length (max 5000 characters)
    if (comment && (typeof comment !== "string" || comment.length > 5000)) {
      return NextResponse.json({ error: "Comment must be less than 5000 characters" }, { status: 400 })
    }

    // Verify the post/video exists and is published
    if (type === "POST") {
      const post = await prisma.performancePost.findUnique({
        where: { id: postId.trim() },
        select: { id: true, published: true }
      })
      if (!post || !post.published) {
        return NextResponse.json({ error: "Post not found or not available" }, { status: 404 })
      }
    } else {
      const video = await prisma.tradingVideo.findUnique({
        where: { id: videoId.trim() },
        select: { id: true }
      })
      if (!video) {
        return NextResponse.json({ error: "Video not found" }, { status: 404 })
      }
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
        postId: type === "POST" ? postId.trim() : null,
        videoId: type === "VIDEO" ? videoId.trim() : null,
        rating,
        comment: comment ? comment.trim().substring(0, 5000) : null,
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
    
    // Validate and sanitize userId
    if (userId) {
      if (typeof userId !== "string" || userId.trim().length === 0) {
        return NextResponse.json({ error: "Invalid user ID" }, { status: 400 })
      }
      where.userId = userId.trim()
    }
    
    // Validate type
    if (type && (type === "POST" || type === "VIDEO")) {
      where.type = type
    }

    // Validate status
    if (status) {
      if (status !== "PENDING" && status !== "APPROVED" && status !== "REJECTED") {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 })
      }
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
