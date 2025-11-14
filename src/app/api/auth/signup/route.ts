import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { prisma } from "@/lib/db"

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

const normalizeName = (name: string) =>
  name
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\p{C}+/gu, "")

const generateUniqueUsername = async (name: string) => {
  const base = normalizeName(name) || `Trader ${Date.now().toString().slice(-6)}`
  const maxLength = 40
  const truncatedBase = base.length > maxLength ? base.slice(0, maxLength).trim() : base

  let attempt = 0
  let candidate = truncatedBase

  while (attempt < 50) {
    const existing = await prisma.user.findUnique({
      where: { username: candidate },
      select: { id: true },
    })
    if (!existing) {
      return candidate
    }
    attempt += 1
    const suffix = ` ${attempt + 1}`
    const prefixLength = Math.max(1, maxLength - suffix.length)
    candidate = `${truncatedBase.slice(0, prefixLength)}${suffix}`
  }

  return `${truncatedBase.slice(0, maxLength - 7)} ${Date.now().toString().slice(-6)}`
}

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
    console.error("Error during sign up:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}