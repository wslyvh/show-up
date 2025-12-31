import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // List of paths to redirect to home
  const pathsToRedirect = ['/create', '/events', '/notifications', '/past', '/profile', '/tickets']

  // Check if pathname matches any redirect path or starts with them
  const shouldRedirect =
    pathsToRedirect.some((path) => pathname === path || pathname.startsWith(`${path}/`)) ||
    // Redirect dynamic [id] routes (but not root)
    (pathname !== '/' && pathname.split('/').filter(Boolean).length === 1 && !pathname.startsWith('/api'))

  if (shouldRedirect) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, icons, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|icons|sw.js|workbox-.*\\.js).*)',
  ],
}
