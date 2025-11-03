import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "TRADER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all posts by the trader
    const posts = await prisma.performancePost.findMany()
    
    // Get all reviews
    const reviews = await prisma.review.findMany({
      include: {
        post: true,
        video: true
      }
    })

    // Get conversations where trader is involved
    const conversations = await prisma.conversation.findMany({
      where: {
        traderId: session.user.id
      }
    })

    // Get unread messages count
    const unreadMessages = await prisma.message.count({
      where: {
        read: false,
        conversation: {
          traderId: session.user.id
        },
        senderId: {
          not: session.user.id
        }
      }
    })

    // Calculate stats
    const totalPosts = posts.length
    const publishedPosts = posts.filter(post => post.published).length
    
    const totalReviews = reviews.length
    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 0
    
    const totalConversations = conversations.length
    const unreadCount = unreadMessages
    
    // Mock total views (in a real app, you'd track this)
    const totalViews = posts.reduce((sum) => sum + Math.floor(Math.random() * 1000), 0)

    const stats = {
      totalPosts,
      publishedPosts,
      totalReviews,
      averageRating,
      totalConversations,
      unreadMessages: unreadCount,
      totalViews
    }

    return NextResponse.json({ stats })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
