import { PrismaAdapter } from "@auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"

export const authOptions = {
  adapter: PrismaAdapter(prisma),
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

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

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
          bio: (user as any).bio ?? null,
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
        const latestUser = await prisma.user.findUnique({
          where: { id: mutableToken.sub },
        })
        if (latestUser) {
          const latest = latestUser as any
          mutableToken.name = latest.username ?? mutableToken.name
          mutableToken.email = latest.email ?? mutableToken.email
          mutableToken.picture = latest.image ?? mutableToken.picture ?? null
          mutableToken.role = latest.role ?? mutableToken.role
          mutableToken.bio = latest.bio ?? mutableToken.bio ?? null
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
