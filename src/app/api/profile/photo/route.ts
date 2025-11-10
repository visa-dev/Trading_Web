import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { del } from "@vercel/blob"

const BLOB_HOST_SUFFIX = ".blob.vercel-storage.com"

function isVercelBlobUrl(url: string | null | undefined): url is string {
  if (!url) return false
  try {
    const parsed = new URL(url)
    return parsed.hostname.endsWith(BLOB_HOST_SUFFIX)
  } catch {
    return false
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { imageUrl } = await request.json()

    if (imageUrl !== null && typeof imageUrl !== "string") {
      return NextResponse.json({ error: "Invalid image URL" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { image: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const previousImageUrl = user.image ?? null

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        image: imageUrl,
      },
    })

    if (
      previousImageUrl &&
      previousImageUrl !== imageUrl &&
      isVercelBlobUrl(previousImageUrl) &&
      process.env.BLOB_READ_WRITE_TOKEN
    ) {
      try {
        await del(previousImageUrl, { token: process.env.BLOB_READ_WRITE_TOKEN })
      } catch (error) {
        console.error("Failed to delete previous profile image from blob:", error)
      }
    }

    return NextResponse.json({ success: true, imageUrl })
  } catch (error) {
    console.error("Error updating profile photo:", error)
    return NextResponse.json({ error: "Failed to update profile photo" }, { status: 500 })
  }
}

