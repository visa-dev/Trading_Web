import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "TRADER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const params = await context.params
    const { id } = params
    const body = await request.json()
    const { status } = body

    if (!status || !["PENDING", "APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    // Check if review exists
    const existingReview = await prisma.traderReview.findUnique({
      where: { id }
    })

    if (!existingReview) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 })
    }

    // Update the review status
    const review = await prisma.traderReview.update({
      where: { id },
      data: { status },
      include: {
        user: {
          select: {
            username: true,
            image: true,
          }
        }
      }
    })

    return NextResponse.json({ review })
  } catch (error) {
    console.error("Error updating trader review:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

