import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // Middleware simples que apenas permite o fluxo continuar
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Permitir acesso às páginas públicas
        if (
          req.nextUrl.pathname.startsWith('/api/auth') ||
          req.nextUrl.pathname.startsWith('/auth/signin') ||
          req.nextUrl.pathname === '/' ||
          req.nextUrl.pathname.startsWith('/api/seed')
        ) {
          return true
        }

        // Para outras páginas, verificar se tem token
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}