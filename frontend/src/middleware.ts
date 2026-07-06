import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('solix_token')?.value
  const { pathname } = request.nextUrl

  const isAuth = pathname.startsWith('/login') || pathname.startsWith('/register')
  const isDashboard = pathname.startsWith('/dashboard') ||
    pathname.startsWith('/forecast') ||
    pathname.startsWith('/surplus') ||
    pathname.startsWith('/recommendations') ||
    pathname.startsWith('/ingestion')

  if (isDashboard && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  if (isAuth && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}