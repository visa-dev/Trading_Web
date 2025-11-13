import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

const MAX_BIO_LENGTH = 600

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const bioValue = body?.bio

    if (bioValue !== null && typeof bioValue !== "string") {
      return NextResponse.json({ error: "Invalid bio" }, { status: 400 })
    }

    const trimmedBio =
      typeof bioValue === "string" ? bioValue.trim().replace(/\s+/g, " ").slice(0, MAX_BIO_LENGTH) : null

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        bio: trimmedBio,
      },
    })

    return NextResponse.json({ success: true, bio: trimmedBio })
  } catch (error) {
    console.error("Error updating bio:", error)
    return NextResponse.json({ error: "Failed to update bio" }, { status: 500 })
  }
}

