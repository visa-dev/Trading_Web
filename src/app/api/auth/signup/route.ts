import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db"

const MIN_PASSWORD_LENGTH = 8

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const sanitizeUsername = (name: string) => {
  const base = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 20)
    .replace(/-+$/g, "")

  return base.length > 0 ? base : "user"
}

const generateUniqueUsername = async (name: string) => {
  const base = sanitizeUsername(name)
  let candidate = base
  let suffix = 1

  while (await prisma.user.findUnique({ where: { username: candidate } })) {
    candidate = `${base}-${suffix}`
    suffix += 1
    if (candidate.length > 30) {
      const trimmedBase = base.slice(0, Math.max(1, 30 - (`-${suffix}`).length))
      candidate = `${trimmedBase}-${suffix}`
    }
  }

  return candidate
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null)
    const name: string | undefined = body?.name
    const email: string | undefined = body?.email
    const password: string | undefined = body?.password

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required." }, { status: 400 })
    }

    const trimmedName = name.trim()
    const normalizedEmail = email.trim().toLowerCase()

    if (trimmedName.length < 2) {
      return NextResponse.json({ error: "Please provide a valid name." }, { status: 400 })
    }

    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 })
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      return NextResponse.json(
        { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.` },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    })

    if (existingUser) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 })
    }

    const username = await generateUniqueUsername(trimmedName)
    const passwordHash = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        username,
        passwordHash,
        role: "USER"
      },
      select: {
        id: true,
        email: true,
        username: true,
        role: true
      }
    })

    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

