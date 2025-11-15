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
    .union([
      z.string().url("Profile image URL is invalid"),
      z.literal(""),
      z.null(),
      z.undefined(),
    ])
    .optional()
    .transform((val) => (val === "" || val === null || val === undefined ? undefined : val)),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = signUpSchema.safeParse(body)

    if (!parsed.success) {
      const errorMessage = parsed.error.issues[0]?.message ?? "Invalid request payload"
      return NextResponse.json({ error: errorMessage }, { status: 400 })
    }

    const { name, email, password, imageUrl } = parsed.data

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    })

    if (existingUser) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 })
    }

    const username = await generateUniqueUsername(name)
    const passwordHash = await bcrypt.hash(password, 12)

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

    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: process.env.NODE_ENV === "development" ? (error instanceof Error ? error.message : String(error)) : undefined
      },
      { status: 500 }
    )
  }
}