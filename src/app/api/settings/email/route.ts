import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"
import { z } from "zod"

export const dynamic = "force-dynamic"

const updateEmailSchema = z.object({
  newEmail: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "TRADER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validation = updateEmailSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0]?.message || "Invalid input" },
        { status: 400 }
      )
    }

    const { newEmail, password } = validation.data
    const normalizedNewEmail = newEmail.trim().toLowerCase()

    // Check if email is already in use
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedNewEmail },
      select: { id: true },
    })

    if (existingUser && existingUser.id !== session.user.id) {
      return NextResponse.json({ error: "Email is already in use" }, { status: 400 })
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

    // Verify password
    const isValidPassword = await bcrypt.compare(password, currentUser.passwordHash)

    if (!isValidPassword) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 })
    }

    // Update email
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { email: normalizedNewEmail },
      select: { id: true, email: true },
    })

    return NextResponse.json({
      message: "Email updated successfully",
      email: updatedUser.email,
    })
  } catch (error) {
    console.error("Error updating email:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

