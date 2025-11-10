const ensureProtocol = (rawUrl?: string | null): string | null => {
  if (!rawUrl) return null
  const trimmed = rawUrl.trim()
  if (!trimmed) return null

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed
  }

  return `https://${trimmed.replace(/^\/+/, "")}`
}

const isYouTubeHostname = (hostname: string) => {
  const normalized = hostname.toLowerCase()
  return (
    normalized === "youtube.com" ||
    normalized === "www.youtube.com" ||
    normalized === "m.youtube.com" ||
    normalized.endsWith(".youtube.com") ||
    normalized === "youtu.be"
  )
}

export const extractYouTubeVideoId = (rawUrl: string): string | null => {
  try {
    const preparedUrl = ensureProtocol(rawUrl)
    if (!preparedUrl) return null

    const url = new URL(preparedUrl)

    if (!isYouTubeHostname(url.hostname)) {
      return null
    }

    if (url.hostname === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0]
      return id ?? null
    }

    if (url.searchParams.has("v")) {
      return url.searchParams.get("v")
    }

    const pathSegments = url.pathname.split("/").filter(Boolean)
    if (pathSegments.length === 0) return null

    const [firstSegment, secondSegment] = pathSegments

    if (firstSegment === "embed" && secondSegment) {
      return secondSegment
    }

    if (firstSegment === "shorts" && secondSegment) {
      return secondSegment
    }

    if (firstSegment === "live" && secondSegment) {
      return secondSegment
    }

    if (pathSegments.length === 1 && pathSegments[0].length === 11) {
      return pathSegments[0]
    }

    return null
  } catch {
    return null
  }
}

export const extractGoogleDriveId = (rawUrl: string): string | null => {
  try {
    const preparedUrl = ensureProtocol(rawUrl)
    if (!preparedUrl) return null

    const url = new URL(preparedUrl)
    const hostname = url.hostname.toLowerCase()
    if (!hostname.includes("drive.google.com") && !hostname.includes("docs.google.com")) {
      return null
    }

    const filePattern = /\/file\/d\/([^/]+)/
    const fileMatch = url.pathname.match(filePattern)
    if (fileMatch?.[1]) {
      return fileMatch[1]
    }

    const idFromQuery = url.searchParams.get("id") || url.searchParams.get("fileId")
    if (idFromQuery) {
      return idFromQuery
    }

    const ucIdMatch = url.searchParams.get("export")
    if (ucIdMatch) {
      return url.searchParams.get("id")
    }

    return null
  } catch {
    return null
  }
}

const isDirectVideoFile = (rawUrl: string): boolean => {
  try {
    const preparedUrl = ensureProtocol(rawUrl)
    if (!preparedUrl) return false
    const url = new URL(preparedUrl)
    const videoExtensions = [".mp4", ".webm", ".ogg", ".ogv", ".mov", ".m4v"]
    return videoExtensions.some((ext) => url.pathname.toLowerCase().endsWith(ext))
  } catch {
    return false
  }
}

export type VideoSourceType = "YOUTUBE" | "GOOGLE_DRIVE" | "FILE" | "UNKNOWN"

export interface VideoSourceInfo {
  type: VideoSourceType
  embedUrl: string
  originalUrl: string
  videoId?: string
  thumbnail?: string | null
}

export const resolveVideoSource = (rawUrl?: string | null): VideoSourceInfo | null => {
  const normalizedUrl = ensureProtocol(rawUrl)
  if (!normalizedUrl) return null

  const youtubeId = extractYouTubeVideoId(normalizedUrl)
  if (youtubeId) {
    return {
      type: "YOUTUBE",
      embedUrl: `https://www.youtube.com/embed/${youtubeId}`,
      originalUrl: normalizedUrl,
      videoId: youtubeId,
      thumbnail: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
    }
  }

  const driveId = extractGoogleDriveId(normalizedUrl)
  if (driveId) {
    return {
      type: "GOOGLE_DRIVE",
      embedUrl: `https://drive.google.com/file/d/${driveId}/preview`,
      originalUrl: normalizedUrl,
      thumbnail: null,
    }
  }

  if (isDirectVideoFile(normalizedUrl)) {
    return {
      type: "FILE",
      embedUrl: normalizedUrl,
      originalUrl: normalizedUrl,
      thumbnail: null,
    }
  }

  return {
    type: "UNKNOWN",
    embedUrl: normalizedUrl,
    originalUrl: normalizedUrl,
    thumbnail: null,
  }
}

