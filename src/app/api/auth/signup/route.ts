import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { prisma } from "@/lib/db"
import { generateUniqueUsername } from "@/lib/user"

const signUpSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters long"),
  email: z.string().trim().toLowerCase().email("Please provide a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Za-z]/, "Password must contain letters")
    .regex(/[0-9]/, "Password must contain numbers"),
  imageUrl: z
    .string()
    .url("Profile image URL is invalid")
    .optional()
    .or(z.literal("").transform(() => undefined)),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("[SIGNUP] Received signup request:", { email: body.email, hasName: !!body.name })
    
    const parsed = signUpSchema.safeParse(body)

    if (!parsed.success) {
      const errorMessage = parsed.error.issues[0]?.message ?? "Invalid request payload"
      console.error("[SIGNUP] Validation error:", parsed.error.issues)
      return NextResponse.json({ error: errorMessage }, { status: 400 })
    }

    const { name, email, password, imageUrl } = parsed.data
    console.log("[SIGNUP] Processing signup for:", email)

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    })

    if (existingUser) {
      console.log("[SIGNUP] User already exists:", email)
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 })
    }

    console.log("[SIGNUP] Generating username for:", name)
    const username = await generateUniqueUsername(name)
    console.log("[SIGNUP] Generated username:", username)
    
    const passwordHash = await bcrypt.hash(password, 12)
    console.log("[SIGNUP] Password hashed, creating user...")

    const user = await prisma.user.create({
      data: {
        email,
        username,
        passwordHash,
        image: imageUrl ?? null,
        role: "USER",
      },
      select: {
        id: true,
        email: true,
        username: true,
        image: true,
      },
    })

    console.log("[SIGNUP] User created successfully:", { id: user.id, email: user.email, username: user.username })
    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    console.error("[SIGNUP] Error during sign up:", error)
    if (error instanceof Error) {
      console.error("[SIGNUP] Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
      })
    }
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: process.env.NODE_ENV === "development" ? (error instanceof Error ? error.message : String(error)) : undefined
      },
      { status: 500 }
    )
  }
}