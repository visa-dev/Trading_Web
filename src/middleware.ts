import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const { pathname } = req.nextUrl

    // If user is authenticated and has a role
    if (token?.role) {
      // Redirect traders away from user-side pages
      if (token.role === "TRADER") {
        // Allow access to dashboard, profile, and auth pages
        if (pathname.startsWith('/dashboard') || 
            pathname.startsWith('/profile') ||
            pathname.startsWith('/auth') ||
            pathname.startsWith('/api/')) {
          return NextResponse.next()
        }
        
        // Redirect traders to dashboard from any other page
        if (pathname === '/' || 
            pathname.startsWith('/posts') || 
            pathname.startsWith('/chat') ||
            pathname.startsWith('/reviews') ||
            pathname.startsWith('/videos')) {
          return NextResponse.redirect(new URL('/dashboard', req.url))
        }
      }
      
      // Redirect users away from trader-only pages
      if (token.role === "USER") {
        if (pathname.startsWith('/dashboard')) {
          return NextResponse.redirect(new URL('/', req.url))
        }
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to public pages
        if (req.nextUrl.pathname.startsWith('/auth') || 
            req.nextUrl.pathname === '/' ||
            req.nextUrl.pathname.startsWith('/api/auth') ||
            req.nextUrl.pathname.startsWith('/posts') ||
            req.nextUrl.pathname.startsWith('/videos') ||
            req.nextUrl.pathname.startsWith('/contact') ||
            req.nextUrl.pathname.startsWith('/academy')) {
          return true
        }
        
        // Require authentication for protected routes
        if (req.nextUrl.pathname.startsWith('/dashboard') ||
            req.nextUrl.pathname.startsWith('/chat') ||
            req.nextUrl.pathname.startsWith('/reviews') ||
            req.nextUrl.pathname.startsWith('/profile')) {
          return !!token
        }
        
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*", 
    "/chat/:path*", 
    "/reviews/:path*",
    "/posts/:path*",
    "/videos/:path*",
    "/profile/:path*"
  ]
}
