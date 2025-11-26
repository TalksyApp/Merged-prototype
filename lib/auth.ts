import { getServerSession } from "next-auth/next"
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { sql } from "@/lib/db"
import { initializeDatabase } from "@/lib/db"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required")
        }

        try {
          await initializeDatabase()

          const users = await sql`
            SELECT id, username, email, password_hash, avatar_initials
            FROM users
            WHERE email = ${credentials.email}
          `

          if (users.length === 0) {
            throw new Error("Invalid email or password")
          }

          const user = users[0]

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password_hash
          )

          if (!isPasswordValid) {
            throw new Error("Invalid email or password")
          }

          return {
            id: user.id,
            email: user.email,
            name: user.username,
            image: user.avatar_initials,
          }
        } catch (error) {
          console.error("Auth error:", error)
          throw new Error("Authentication failed")
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth",
    signOut: "/auth",
    error: "/auth",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

// Server-side session helper
export const auth = () => getServerSession(authOptions)
