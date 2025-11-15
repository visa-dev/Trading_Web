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
    
    // Validate conversationId format
    if (!conversationId || typeof conversationId !== "string" || conversationId.trim().length === 0) {
      return NextResponse.json({ error: "Invalid conversation ID" }, { status: 400 })
    }
    
    const body = await request.json()
    const { content } = body

    // Validate content
    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json({ error: "Message content is required" }, { status: 400 })
    }

    // Limit message length to prevent DoS (max 10000 characters)
    if (content.length > 10000) {
      return NextResponse.json({ error: "Message content must be less than 10000 characters" }, { status: 400 })
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

    // Create the message (sanitize content)
    const sanitizedContent = content.trim().substring(0, 10000)
    const message = await prisma.message.create({
      data: {
        conversationId: conversationId.trim(),
        senderId: session.user.id,
        content: sanitizedContent,
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
        lastMessage: sanitizedContent,
        updatedAt: new Date(),
        unreadCount: senderIsUser ? { increment: 1 } : { set: 0 },
      }
    })

    let autoReply: typeof message | null = null

    if (senderIsUser) {
      const existingTraderReply = await prisma.message.findFirst({
        where: {
          conversationId,
          senderId: conversation.traderId,
        },
        select: {
          id: true,
        },
      })

      if (!existingTraderReply && conversation.traderId) {
        const { BRAND_NAME, SOCIAL_LINKS, BRAND_PHONE_SHORT, BRAND_EMAIL_ALTERNATIVE, BRAND_PHONE_LINK } = await import("@/lib/constants")
        
        // Get contact info from social links
        const telegramLink = SOCIAL_LINKS.find(s => s.label === "Telegram")
        const facebookLink = SOCIAL_LINKS.find(s => s.label === "Facebook")
        const instagramLink = SOCIAL_LINKS.find(s => s.label === "Instagram")
        
        // Create formatted message with clickable links using HTML
        const autoReplyContent = [
          `👋 ${BRAND_NAME} will contact you within 24 hours.`,
          "",
          "📞 For urgent matters, you can reach out via:",
          "",
          telegramLink ? `🔹 <a href="${telegramLink.href}" target="_blank" rel="noopener noreferrer" style="color: #f59e0b; text-decoration: underline;">Telegram: ${telegramLink.href}</a>` : "",
          facebookLink ? `🔹 <a href="${facebookLink.href}" target="_blank" rel="noopener noreferrer" style="color: #f59e0b; text-decoration: underline;">Facebook: ${facebookLink.href}</a>` : "",
          instagramLink ? `🔹 <a href="${instagramLink.href}" target="_blank" rel="noopener noreferrer" style="color: #f59e0b; text-decoration: underline;">Instagram: ${instagramLink.href}</a>` : "",
          `🔹 <a href="tel:${BRAND_PHONE_LINK}" style="color: #f59e0b; text-decoration: underline;">Call / WhatsApp: ${BRAND_PHONE_SHORT}</a>`,
          `🔹 <a href="mailto:${BRAND_EMAIL_ALTERNATIVE}" style="color: #f59e0b; text-decoration: underline;">Email: ${BRAND_EMAIL_ALTERNATIVE}</a>`,
        ].filter(Boolean).join("\n")

        autoReply = await prisma.message.create({
          data: {
            conversationId,
            senderId: conversation.traderId,
            content: autoReplyContent,
          },
          include: {
            sender: {
              select: {
                username: true,
                image: true,
                role: true,
              },
            },
          },
        })

        await prisma.conversation.update({
          where: { id: conversationId },
          data: {
            lastMessage: autoReplyContent,
            updatedAt: new Date(),
          },
        })
      }
    }

    return NextResponse.json({ message, autoReply }, { status: 201 })
  } catch (error) {
    console.error("Error creating message:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
