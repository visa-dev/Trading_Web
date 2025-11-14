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

const baseAdapter = PrismaAdapter(prisma)

// Custom adapter that extends PrismaAdapter to handle username generation and account linking
const customAdapter: Adapter = {
  ...baseAdapter,
  async createUser(user: {
    email: string
    emailVerified?: Date | null
    name?: string | null
    image?: string | null
  }) {
    try {
      const normalizedEmail = user.email.trim().toLowerCase()
      
      if (!normalizedEmail) {
        throw new Error("Email is required to create user")
      }
      
      // Check if user already exists (could be from email/password signup)
      const existingUser = await prisma.user.findUnique({
        where: { email: normalizedEmail },
        select: { id: true, email: true, username: true, image: true },
      })

      if (existingUser) {
        // User exists, return it instead of creating a new one
        // Map username to name for adapter compatibility
        return {
          id: existingUser.id,
          email: existingUser.email,
          emailVerified: null, // Our schema doesn't have emailVerified
          name: existingUser.username, // Map username to name
          image: existingUser.image,
        }
      }

      // Generate unique username
      const baseName =
        user.name ??
        (user.email ? user.email.split("@")[0] : null) ??
        `Trader ${Date.now().toString().slice(-6)}`
      const username = await generateUniqueUsername(String(baseName))

      // Create new user with username and role
      const newUser = await prisma.user.create({
        data: {
          email: normalizedEmail,
          username,
          image: user.image ?? null,
          role: "USER",
        },
        select: {
          id: true,
          email: true,
          username: true,
          image: true,
        },
      })

      return {
        id: newUser.id,
        email: newUser.email,
        emailVerified: null, // Our schema doesn't have emailVerified
        name: newUser.username, // Map username to name
        image: newUser.image,
      }
    } catch (error) {
      console.error("Error in customAdapter.createUser:", error)
      throw error
    }
  },
}

export const authOptions = {
  adapter: customAdapter,
  secret: process.env.NEXTAUTH_SECRET,
  // Ensure proper URL handling in production
  trustHost: true, // Required for Vercel deployments
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

        const normalizedEmail = credentials.email.trim().toLowerCase()
        const password = credentials.password

        if (password.length === 0) {
          return null
        }

        const user = await fetchUserForCredentials(normalizedEmail)

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
    async signIn({ user, account }: {
      user: { id?: string; email?: string | null; name?: string | null; image?: string | null }
      account: { provider?: string } | null
    }) {
      try {
        // The custom adapter handles user creation and account linking automatically
        // For Google OAuth, if a user exists with the same email, the adapter will return that user
        // and the PrismaAdapter will link the Google account to it
        
        // Allow all sign-ins - Google OAuth and credentials
        return true
      } catch (error) {
        console.error("Error in signIn callback:", error)
        // Still allow sign-in to proceed, but log the error
        return true
      }
    },
    async jwt({ token, user, trigger, account }: {
      token: Record<string, unknown>
      user?: { id?: string; email?: string | null; name?: string | null; image?: string | null; role?: string | null; bio?: string | null }
      trigger?: string
      account?: { provider?: string } | null
    }) {
      const mutableToken = token as {
        sub?: string
        role?: string | null
        name?: string | null
        email?: string | null
        picture?: string | null
        bio?: string | null
        [key: string]: unknown
      }
      
      // On initial sign-in, fetch user data from database to ensure we have role and all fields
      if (user && account) {
        const userId = user.id ?? mutableToken.sub
        if (userId) {
          const dbUser = await fetchUserById(userId)
          if (dbUser) {
            mutableToken.role = dbUser.role ?? "USER"
            mutableToken.name = dbUser.username ?? user.name ?? null
            mutableToken.email = dbUser.email ?? user.email ?? null
            mutableToken.picture = dbUser.image ?? user.image ?? null
            mutableToken.bio = "bio" in dbUser ? dbUser.bio ?? null : null
          } else {
            // Fallback to user object if DB fetch fails
            const typedUser = user as {
              role?: string | null
              name?: string | null
              email?: string | null
              image?: string | null
              bio?: string | null
            }
            mutableToken.role = typedUser.role ?? "USER"
            mutableToken.name = typedUser.name ?? mutableToken.name ?? null
            mutableToken.email = typedUser.email ?? mutableToken.email ?? null
            mutableToken.picture = typedUser.image ?? mutableToken.picture ?? null
            mutableToken.bio = typedUser.bio ?? mutableToken.bio ?? null
          }
        }
      }
      
      // Update token when session is updated
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
    async session({ session, token }: {
      session: { user: { id?: string | null; name?: string | null; email?: string | null; image?: string | null; role?: string | null; bio?: string | null } }
      token: Record<string, unknown>
    }) {
      const mutableToken = token as {
        sub?: string
        role?: string | null
        name?: string | null
        email?: string | null
        picture?: string | null
        bio?: string | null
      }
      const mutableSessionUser = session.user as {
        id?: string | null
        name?: string | null
        email?: string | null
        image?: string | null
        role?: string | null
        bio?: string | null
      }

      if (mutableToken) {
        mutableSessionUser.id = mutableToken.sub ?? mutableSessionUser.id ?? null
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
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // Use NEXTAUTH_URL if available, otherwise use baseUrl
      const nextAuthUrl = process.env.NEXTAUTH_URL || baseUrl
      
      // Handle relative URLs
      if (url.startsWith("/")) {
        return `${nextAuthUrl}${url}`
      }
      
      // Handle absolute URLs on the same origin
      try {
        const urlObj = new URL(url)
        const baseUrlObj = new URL(nextAuthUrl)
        if (urlObj.origin === baseUrlObj.origin) {
          return url
        }
      } catch (error) {
        // If URL parsing fails, return the base URL
        console.error("Error parsing redirect URL:", error)
      }
      
      // Default to base URL
      return nextAuthUrl
    },
  },
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
  },
}
