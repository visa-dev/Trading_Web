import type { Session } from "next-auth"
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

async function deleteBlobByUrl(url: string) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return
  }

  try {
    await del(url, { token: process.env.BLOB_READ_WRITE_TOKEN })
  } catch (error) {
    console.error("Failed to delete previous profile image from blob:", error)
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = (await getServerSession(authOptions)) as (Session & {
      user?: Session["user"] & { id?: string | null }
    }) | null

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let body: unknown = null
    try {
      body = await request.json()
    } catch (parseError) {
      console.error("Failed to parse request body for profile photo update:", parseError)
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Request body must be an object with imageUrl" }, { status: 400 })
    }

    const maybeImageUrl =
      (body as { imageUrl?: unknown }).imageUrl ?? (body as { image_url?: unknown }).image_url

    if (maybeImageUrl !== null && typeof maybeImageUrl !== "string") {
      return NextResponse.json({ error: "Invalid image URL" }, { status: 400 })
    }

    const imageUrl =
      typeof maybeImageUrl === "string" && maybeImageUrl.trim().length > 0
        ? maybeImageUrl.trim()
        : null

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { image: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const previousImageUrl = user.image ?? null

    if (previousImageUrl === imageUrl) {
      return NextResponse.json({ success: true, imageUrl })
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        image: imageUrl,
      },
    })

    if (previousImageUrl && previousImageUrl !== imageUrl && isVercelBlobUrl(previousImageUrl)) {
      await deleteBlobByUrl(previousImageUrl)
    }

    return NextResponse.json({ success: true, imageUrl })
  } catch (error) {
    console.error("Error updating profile photo:", error)
    return NextResponse.json(
      {
        error: "Failed to update profile photo",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}

