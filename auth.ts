import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Simple hardcoded admin credentials for now
        // In production, you would verify against a database
        if (
          credentials?.email === "admin@adoria.lv" &&
          credentials?.password === "admin123"
        ) {
          return {
            id: "1",
            email: "admin@adoria.lv",
            name: "Admin"
          }
        }
        return null
      }
    })
  ],
  pages: {
    signIn: "/admin/sign-in"
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnAdmin = nextUrl.pathname.startsWith('/admin')
      const isOnSignIn = nextUrl.pathname === '/admin/sign-in'

      if (isOnAdmin && !isOnSignIn) {
        if (isLoggedIn) return true
        return false // Redirect unauthenticated users to login page
      }

      if (isOnSignIn && isLoggedIn) {
        return Response.redirect(new URL('/admin', nextUrl))
      }

      return true
    }
  },
  session: {
    strategy: "jwt"
  }
})