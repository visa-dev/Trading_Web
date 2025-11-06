import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { userId: session.user.id },
          { traderId: session.user.id }
        ]
      },
      include: {
        user: {
          select: {
            username: true,
            image: true,
          }
        },
        trader: {
          select: {
            username: true,
            image: true,
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    return NextResponse.json({ conversations })
  } catch (error) {
    console.error("Error fetching conversations:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only users can start conversations with traders
    if (session.user.role !== "USER") {
      return NextResponse.json({ error: "Only users can start conversations" }, { status: 403 })
    }

    // Find a trader to chat with
    const trader = await prisma.user.findFirst({
      where: {
        role: "TRADER"
      }
    })

    if (!trader) {
      return NextResponse.json({ error: "No trader available" }, { status: 404 })
    }

    // Check if conversation already exists
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        userId: session.user.id,
        traderId: trader.id
      }
    })

    if (existingConversation) {
      return NextResponse.json({ 
        message: "Conversation already exists",
        conversation: existingConversation 
      })
    }

    // Create new conversation
    const conversation = await prisma.conversation.create({
      data: {
        userId: session.user.id,
        traderId: trader.id
      },
      include: {
        user: {
          select: {
            username: true,
            image: true,
          }
        },
        trader: {
          select: {
            username: true,
            image: true,
          }
        }
      }
    })

    return NextResponse.json({ conversation }, { status: 201 })
  } catch (error) {
    console.error("Error creating conversation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
