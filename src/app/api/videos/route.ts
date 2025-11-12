import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)
    const admin = searchParams.get("admin")

    // If admin request, require trader authentication
    if (admin === "true") {
      if (!session?.user?.id || session.user.role !== "TRADER") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
    }

    const videos = await prisma.tradingVideo.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ videos })
  } catch (error) {
    console.error("Error fetching videos:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "TRADER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, youtubeUrl, description } = body

    // Validate required fields
    if (!title || !youtubeUrl || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate YouTube URL
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/
    if (!youtubeRegex.test(youtubeUrl)) {
      return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 })
    }

    const video = await prisma.tradingVideo.create({
      data: {
        title,
        youtubeUrl,
        description
      }
    })

    return NextResponse.json({ video }, { status: 201 })
  } catch (error) {
    console.error("Error creating video:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
