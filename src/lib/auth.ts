import { PrismaAdapter } from "@auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"
import type { Adapter } from "next-auth/adapters"
import { generateUniqueUsername } from "@/lib/user"

type BaseUserSelect = {
  id: true
  email: true
  username: true
  role: true
  image: true
  passwordHash?: true
  bio?: true
}

const baseSelect: BaseUserSelect = {
  id: true,
  email: true,
  username: true,
  role: true,
  image: true,
}

const credentialsSelect: BaseUserSelect & { passwordHash: true } = {
  ...baseSelect,
  passwordHash: true,
  bio: true,
}

const sessionSelect: BaseUserSelect = {
  ...baseSelect,
  bio: true,
}

const isMissingBioColumnError = (error: unknown) => {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string" &&
    (error as { message: string }).message.includes("The column `User.bio` does not exist")
  )
}

const fetchUserForCredentials = async (email: string) => {
  try {
    return await prisma.user.findUnique({
      where: { email },
      select: credentialsSelect,
    })
  } catch (error) {
    if (isMissingBioColumnError(error)) {
      const { bio, ...fallbackSelect } = credentialsSelect
      return prisma.user.findUnique({
        where: { email },
        select: fallbackSelect,
      }) as Promise<{
        id: string
        email: string | null
        username: string | null
        role: string
        image: string | null
        passwordHash: string | null
        bio?: string | null
      } | null>
    }
    throw error
  }
}

const fetchUserById = async (id: string) => {
  try {
    return await prisma.user.findUnique({
      where: { id },
      select: sessionSelect,
    })
  } catch (error) {
    if (isMissingBioColumnError(error)) {
      const { bio, ...fallbackSelect } = sessionSelect
      return prisma.user.findUnique({
        where: { id },
        select: fallbackSelect,
      }) as Promise<{
        id: string
        email: string | null
        username: string | null
        role: string
        image: string | null
        bio?: string | null
      } | null>
    }
    throw error
  }
}

const prismaAdapter = PrismaAdapter(prisma)

const adapter: Adapter = {
  ...prismaAdapter,
  async createUser(profile) {
    if (!profile?.email) {
      throw new Error("Google profile did not return an email address.")
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: profile.email },
    })

    if (existingUser) {
      return {
        id: existingUser.id,
        email: existingUser.email,
        emailVerified: null,
        name: existingUser.username,
        image: existingUser.image ?? null,
        role: existingUser.role,
      }
    }

    const image = (profile as Record<string, unknown>).image ?? (profile as Record<string, unknown>).picture ?? null

    const baseName =
      (profile as Record<string, unknown>).username ??
      profile.name ??
      (typeof profile.email === "string" ? profile.email.split("@")[0] : "") ??
      `Trader ${Date.now().toString().slice(-6)}`

    const username = await generateUniqueUsername(String(baseName))

    const user = await prisma.user.create({
      data: {
        email: profile.email,
        username,
        image: typeof image === "string" ? image : null,
        role: "USER",
      },
    })

    const emailVerified =
      profile.emailVerified instanceof Date
        ? profile.emailVerified
        : typeof profile.emailVerified === "string"
          ? new Date(profile.emailVerified)
          : null

    return {
      id: user.id,
      email: user.email,
      emailVerified,
      name: user.username,
      image: user.image ?? null,
      role: user.role,
    }
  },
}

type BaseUserSelect = {
  id: true
  email: true
  username: true
  role: true
  image: true
  passwordHash?: true
  bio?: true
}

const baseSelect: BaseUserSelect = {
  id: true,
  email: true,
  username: true,
  role: true,
  image: true,
}

const credentialsSelect: BaseUserSelect & { passwordHash: true } = {
  ...baseSelect,
  passwordHash: true,
  bio: true,
}

const sessionSelect: BaseUserSelect = {
  ...baseSelect,
  bio: true,
}

const isMissingBioColumnError = (error: unknown) => {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string" &&
    (error as { message: string }).message.includes("The column `User.bio` does not exist")
  )
}

const fetchUserForCredentials = async (email: string) => {
  try {
    return await prisma.user.findUnique({
      where: { email },
      select: credentialsSelect,
    })
  } catch (error) {
    if (isMissingBioColumnError(error)) {
      const { bio, ...fallbackSelect } = credentialsSelect
      return prisma.user.findUnique({
        where: { email },
        select: fallbackSelect,
      }) as Promise<{
        id: string
        email: string | null
        username: string | null
        role: string
        image: string | null
        passwordHash: string | null
        bio?: string | null
      } | null>
    }
    throw error
  }
}

const fetchUserById = async (id: string) => {
  try {
    return await prisma.user.findUnique({
      where: { id },
      select: sessionSelect,
    })
  } catch (error) {
    if (isMissingBioColumnError(error)) {
      const { bio, ...fallbackSelect } = sessionSelect
      return prisma.user.findUnique({
        where: { id },
        select: fallbackSelect,
      }) as Promise<{
        id: string
        email: string | null
        username: string | null
        role: string
        image: string | null
        bio?: string | null
      } | null>
    }
    throw error
  }
}

export const authOptions = {
  adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await fetchUserForCredentials(credentials.email)

        if (!user) {
          return null
        }

        if (!user.passwordHash) {
          return null
        }

        const isValidPassword = await bcrypt.compare(credentials.password, user.passwordHash)

        if (!isValidPassword) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.username,
          role: user.role,
          image: user.image ?? null,
          bio: "bio" in user ? (user as { bio?: string | null }).bio ?? null : null,
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger }: { token: any; user?: any; trigger?: string }) {
      const mutableToken = token as any
      if (user) {
        mutableToken.role = (user as any).role
        mutableToken.name = user.name
        mutableToken.email = user.email
        mutableToken.picture = (user as any).image ?? null
        mutableToken.bio = (user as any).bio ?? null
      }
      if (trigger === "update" && mutableToken.sub) {
        const latestUser = await fetchUserById(mutableToken.sub)
        if (latestUser) {
          mutableToken.name = latestUser.username ?? mutableToken.name
          mutableToken.email = latestUser.email ?? mutableToken.email
          mutableToken.picture = latestUser.image ?? mutableToken.picture ?? null
          mutableToken.role = latestUser.role ?? mutableToken.role
          mutableToken.bio =
            "bio" in latestUser ? latestUser.bio ?? mutableToken.bio ?? null : mutableToken.bio ?? null
        }
      }
      return mutableToken
    },
    async session({ session, token }: { session: any; token: any }) {
      const mutableToken = token as any
      const mutableSessionUser = session.user as any

      if (mutableToken) {
        mutableSessionUser.id = mutableToken.sub ?? mutableSessionUser.id
        if (typeof mutableToken.name === "string") {
          mutableSessionUser.name = mutableToken.name
        }
        if (typeof mutableToken.email === "string") {
          mutableSessionUser.email = mutableToken.email
        }
        mutableSessionUser.image =
          typeof mutableToken.picture === "string" ? mutableToken.picture : mutableSessionUser.image ?? null
        if (typeof mutableToken.role === "string") {
          mutableSessionUser.role = mutableToken.role
        }
        mutableSessionUser.bio =
          typeof mutableToken.bio === "string" ? mutableToken.bio : mutableSessionUser.bio ?? null
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
  },
}
