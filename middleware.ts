import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdmin = token && (token as any).role === 'admin'
    const isLoginPage = req.nextUrl.pathname === '/admin/login'

    // Redirect to login if accessing admin routes without auth
    if (req.nextUrl.pathname.startsWith('/admin') && !isLoginPage && !isAdmin) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }

    // Redirect to dashboard if accessing login page while already authenticated
    if (isLoginPage && isAdmin) {
      return NextResponse.redirect(new URL('/admin', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to login page without auth
        if (req.nextUrl.pathname === '/admin/login') {
          return true
        }
        // For other admin routes, require admin role
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return token !== null && (token as any).role === 'admin'
        }
        return true
      },
    },
  }
)

export const config = {
  matcher: ['/admin/:path*'],
}

