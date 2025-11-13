import type { Session } from "next-auth"
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { put, del } from "@vercel/blob"
import { prisma } from "@/lib/db"

const ALLOWED_FOLDERS = new Set(["performance-posts", "profile-images"])
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
    console.error("Failed to delete blob by URL:", error)
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({ error: "Blob storage token is not configured" }, { status: 500 })
    }

    const formData = await request.formData()
    const file = formData.get("file")
    const folder = typeof formData.get("folder") === "string" ? String(formData.get("folder")) : undefined
    const allowGuest = formData.get("allowGuest")

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    const folderName = folder && ALLOWED_FOLDERS.has(folder) ? folder : "uploads"

    const session = (await getServerSession(authOptions)) as (Session & {
      user?: Session["user"] & { id?: string | null }
    }) | null
    const sessionUserId = session?.user?.id ?? null

    const guestUploadAllowed =
      !sessionUserId && folderName === "profile-images" && allowGuest === "true"

    if (!sessionUserId && !guestUploadAllowed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const safeFileName = file.name
      ? file.name.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9._-]/g, "")
      : "upload"
    const uniqueFileName = `${folderName}/${Date.now()}-${crypto.randomUUID()}-${safeFileName}`

    const blob = await put(uniqueFileName, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
      addRandomSuffix: false,
    })

    if (sessionUserId && folderName === "profile-images") {
      try {
        const user = await prisma.user.findUnique({
          where: { id: sessionUserId },
          select: { image: true },
        })

        const previousImageUrl = user?.image ?? null

        await prisma.user.update({
          where: { id: sessionUserId },
          data: { image: blob.url },
        })

        if (previousImageUrl && previousImageUrl !== blob.url && isVercelBlobUrl(previousImageUrl)) {
          await deleteBlobByUrl(previousImageUrl)
        }
      } catch (error) {
        console.error("Failed to update user profile image after upload:", error)
      }
    }

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}

