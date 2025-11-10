import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { put } from "@vercel/blob"

const ALLOWED_FOLDERS = new Set(["performance-posts", "profile-images"])

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

    const session = await getServerSession(authOptions)

    const guestUploadAllowed =
      !session?.user?.id && folderName === "profile-images" && allowGuest === "true"

    if (!session?.user?.id && !guestUploadAllowed) {
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

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}

