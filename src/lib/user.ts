import { prisma } from "@/lib/db"

const MAX_USERNAME_LENGTH = 40

export const normalizeName = (name: string) =>
  name
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\p{C}+/gu, "")

export const generateUniqueUsername = async (rawName: string) => {
  const base = normalizeName(rawName) || `Trader ${Date.now().toString().slice(-6)}`
  const truncated = base.length > MAX_USERNAME_LENGTH ? base.slice(0, MAX_USERNAME_LENGTH).trim() : base

  let attempt = 0
  let candidate = truncated

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
    const maxPrefixLength = Math.max(1, MAX_USERNAME_LENGTH - suffix.length)
    candidate = `${truncated.slice(0, maxPrefixLength)}${suffix}`
  }

  return `${truncated.slice(0, MAX_USERNAME_LENGTH - 7)} ${Date.now().toString().slice(-6)}`
}

