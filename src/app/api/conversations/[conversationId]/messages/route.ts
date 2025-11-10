import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ conversationId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const params = await context.params
    const { conversationId } = params

    // Verify user has access to this conversation
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [
          { userId: session.user.id },
          { traderId: session.user.id }
        ]
      }
    })

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
    }

    const messages = await prisma.message.findMany({
      where: {
        conversationId
      },
      include: {
        sender: {
          select: {
            username: true,
            image: true,
            role: true,
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    const viewerIsUser = session.user.id === conversation.userId
    const viewerIsTrader = session.user.id === conversation.traderId

    if (viewerIsTrader) {
      await prisma.message.updateMany({
        where: {
          conversationId,
          senderId: conversation.userId,
          read: false,
        },
        data: {
          read: true,
        },
      })

      await prisma.conversation.update({
        where: { id: conversationId },
        data: {
          unreadCount: 0,
        },
      })
    }

    return NextResponse.json({ messages })
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ conversationId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const params = await context.params
    const { conversationId } = params
    const body = await request.json()
    const { content } = body

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: "Message content is required" }, { status: 400 })
    }

    // Verify user has access to this conversation
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [
          { userId: session.user.id },
          { traderId: session.user.id }
        ]
      }
    })

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
    }

    // Create the message
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: session.user.id,
        content: content.trim(),
      },
      include: {
        sender: {
          select: {
            username: true,
            image: true,
            role: true,
          }
        }
      }
    })

    // Update conversation with last message and unread count
    const senderIsUser = session.user.id === conversation.userId

    await prisma.conversation.update({
      where: {
        id: conversationId
      },
      data: {
        lastMessage: content.trim(),
        updatedAt: new Date(),
        unreadCount: senderIsUser ? { increment: 1 } : { set: 0 },
      }
    })

    return NextResponse.json({ message }, { status: 201 })
  } catch (error) {
    console.error("Error creating message:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
