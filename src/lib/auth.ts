import { PrismaAdapter } from "@auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"
import type { Adapter, AdapterAccount } from "next-auth/adapters"
import type { User } from "next-auth"
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
  async getUserByAccount({ providerAccountId, provider }) {
    console.log("[OAUTH] getUserByAccount called:", { provider, providerAccountId })
    try {
      const result = await baseAdapter.getUserByAccount!({ providerAccountId, provider })
      console.log("[OAUTH] getUserByAccount result:", result ? { id: result.id, email: result.email } : null)
      return result
    } catch (error) {
      console.error("[OAUTH] Error in getUserByAccount:", error)
      throw error
    }
  },
  async createUser(user: {
    email: string
    emailVerified?: Date | null
    name?: string | null
    image?: string | null
  }) {
    try {
      console.log("[OAUTH] createUser called with:", { email: user.email, hasName: !!user.name, hasImage: !!user.image })
      
      // Validate email
      if (!user.email || typeof user.email !== 'string') {
        console.error("[OAUTH] Invalid email provided:", user.email)
        // Fallback to base adapter
        console.log("[OAUTH] Falling back to base adapter createUser")
        return await baseAdapter.createUser!(user as any)
      }
      
      const normalizedEmail = user.email.trim().toLowerCase()
      
      if (!normalizedEmail) {
        console.error("[OAUTH] Email is empty after normalization")
        // Fallback to base adapter
        console.log("[OAUTH] Falling back to base adapter createUser")
        return await baseAdapter.createUser!(user as any)
      }
      
      // Check if user already exists (could be from email/password signup)
      console.log("[OAUTH] Checking for existing user:", normalizedEmail)
      let existingUser
      try {
        existingUser = await prisma.user.findUnique({
          where: { email: normalizedEmail },
          select: { id: true, email: true, username: true, image: true },
        })
      } catch (dbError) {
        console.error("[OAUTH] Database query failed, falling back to base adapter:", dbError)
        // Fallback to base adapter if database query fails
        return await baseAdapter.createUser!(user as any)
      }

      if (existingUser) {
        console.log("[OAUTH] User already exists, returning existing user:", existingUser.id)
        // User exists, return it instead of creating a new one
        // Map username to name for adapter compatibility
        return {
          id: existingUser.id,
          email: existingUser.email ?? normalizedEmail,
          emailVerified: null,
          name: existingUser.username ?? user.name ?? normalizedEmail.split("@")[0],
          image: existingUser.image,
        }
      }

      // Generate unique username
      const baseName =
        user.name ??
        (user.email ? user.email.split("@")[0] : null) ??
        `Trader ${Date.now().toString().slice(-6)}`
      console.log("[OAUTH] Generating username from:", baseName)
      
      let username: string
      try {
        username = await generateUniqueUsername(String(baseName))
        console.log("[OAUTH] Generated username:", username)
      } catch (usernameError) {
        console.error("[OAUTH] Username generation failed, using fallback:", usernameError)
        // Fallback to a simple username
        username = `${baseName.replace(/\s+/g, "").substring(0, 30)}${Date.now().toString().slice(-6)}`
        console.log("[OAUTH] Using fallback username:", username)
      }

      // Create new user with username and role
      console.log("[OAUTH] Creating new user in database...")
      let newUser
      try {
        newUser = await prisma.user.create({
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
        console.log("[OAUTH] User created successfully in database:", { id: newUser.id, email: newUser.email, username: newUser.username })
      } catch (createError) {
        console.error("[OAUTH] User creation failed:", createError)
        if (createError instanceof Error) {
          console.error("[OAUTH] Creation error details:", {
            message: createError.message,
            name: createError.name,
            code: (createError as any).code,
          })
          // Check if it's a unique constraint violation (username or email already exists)
          if (createError.message.includes("Unique constraint") || createError.message.includes("Unique constraint failed") || createError.message.includes("P2002")) {
            // Try to find the user again (might have been created by another request)
            try {
              const retryUser = await prisma.user.findUnique({
                where: { email: normalizedEmail },
                select: { id: true, email: true, username: true, image: true },
              })
              if (retryUser) {
                console.log("[OAUTH] User found after creation error, returning:", retryUser.id)
                return {
                  id: retryUser.id,
                  email: retryUser.email ?? normalizedEmail,
                  emailVerified: null,
                  name: retryUser.username ?? user.name ?? normalizedEmail.split("@")[0],
                  image: retryUser.image,
                }
              }
            } catch (retryError) {
              console.error("[OAUTH] Retry query also failed:", retryError)
            }
          }
        }
        // If we can't recover, fallback to base adapter
        console.log("[OAUTH] Falling back to base adapter createUser due to creation error")
        return await baseAdapter.createUser!(user as any)
      }

      // Verify the user was actually created
      if (!newUser || !newUser.id) {
        console.error("[OAUTH] User creation returned invalid result, falling back to base adapter")
        return await baseAdapter.createUser!(user as any)
      }

      console.log("[OAUTH] Returning created user to NextAuth")
      return {
        id: newUser.id,
        email: newUser.email ?? normalizedEmail,
        emailVerified: null,
        name: newUser.username ?? user.name ?? normalizedEmail.split("@")[0],
        image: newUser.image,
      }
    } catch (error) {
      console.error("[OAUTH] Critical error in customAdapter.createUser, falling back to base adapter:", error)
      if (error instanceof Error) {
        console.error("[OAUTH] Error details:", {
          message: error.message,
          stack: error.stack,
          name: error.name,
        })
      }
      // Always fallback to base adapter instead of throwing
      // This ensures the OAuth flow doesn't break
      try {
        console.log("[OAUTH] Attempting base adapter fallback")
        return await baseAdapter.createUser!(user as any)
      } catch (fallbackError) {
        console.error("[OAUTH] Base adapter fallback also failed:", fallbackError)
        // Only throw if both our method and base adapter fail
        throw fallbackError
      }
    }
  },
}

export const authOptions = {
  adapter: customAdapter,
  secret: process.env.NEXTAUTH_SECRET,
  // Ensure proper URL handling in production
  trustHost: true, // Required for Vercel deployments
  events: {
    async createUser(message: unknown) {
      console.log("[NEXTAUTH EVENT] createUser event fired:", message)
    },
    async linkAccount(message: unknown) {
      console.log("[NEXTAUTH EVENT] linkAccount event fired:", message)
    },
    async signIn(message: unknown) {
      console.log("[NEXTAUTH EVENT] signIn event fired:", message)
    },
    error(message: unknown) {
      console.error("[NEXTAUTH EVENT] Error event:", message)
    },
  },
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
        console.log("[SIGNIN CALLBACK] signIn callback called:", { 
          userId: user.id, 
          email: user.email, 
          provider: account?.provider 
        })
        
        // Verify user exists in database after OAuth sign-in
        if (account?.provider === "google" && user.id) {
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { id: true, email: true, username: true },
          })
          console.log("[SIGNIN CALLBACK] User in database after OAuth:", dbUser)
          
          if (!dbUser) {
            console.error("[SIGNIN CALLBACK] WARNING: User authenticated but not found in database!", { userId: user.id, email: user.email })
          }
        }
        
        // The custom adapter handles user creation and account linking automatically
        // For Google OAuth, if a user exists with the same email, the adapter will return that user
        // and the PrismaAdapter will link the Google account to it
        
        // Allow all sign-ins - Google OAuth and credentials
        return true
      } catch (error) {
        console.error("[SIGNIN CALLBACK] Error in signIn callback:", error)
        if (error instanceof Error) {
          console.error("[SIGNIN CALLBACK] Error details:", {
            message: error.message,
            stack: error.stack,
            name: error.name,
          })
        }
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
