import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"
import { z } from "zod"

export const dynamic = "force-dynamic"

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters long"),
})

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "TRADER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validation = updatePasswordSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0]?.message || "Invalid input" },
        { status: 400 }
      )
    }

    const { currentPassword, newPassword } = validation.data

    if (currentPassword === newPassword) {
      return NextResponse.json(
        { error: "New password must be different from current password" },
        { status: 400 }
      )
    }

    // Get current user to verify password
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { passwordHash: true },
    })

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (!currentUser.passwordHash) {
      return NextResponse.json(
        { error: "Password change not available for OAuth accounts" },
        { status: 400 }
      )
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, currentUser.passwordHash)

    if (!isValidPassword) {
      return NextResponse.json({ error: "Incorrect current password" }, { status: 401 })
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12)

    // Update password
    await prisma.user.update({
      where: { id: session.user.id },
      data: { passwordHash: hashedPassword },
    })

    return NextResponse.json({
      message: "Password updated successfully",
    })
  } catch (error) {
    console.error("Error updating password:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

