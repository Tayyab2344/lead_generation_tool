import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('session_token')?.value;
  const { pathname } = request.nextUrl;

  // Define route classifications
  const isAuthRoute = pathname.startsWith('/login') || 
                      pathname.startsWith('/register') || 
                      pathname.startsWith('/forgot-password') || 
                      pathname.startsWith('/reset-password');
  
  const isProtectedRoute = pathname.startsWith('/dashboard') ||
                           pathname.startsWith('/profile') ||
                           pathname.startsWith('/settings') ||
                           pathname.startsWith('/leads') ||
                           pathname.startsWith('/pipeline') ||
                           pathname.startsWith('/campaigns') ||
                           pathname.startsWith('/analytics');

  // If user is authenticated and tries to visit auth routes, redirect to dashboard
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If user is not authenticated and tries to visit protected routes, redirect to login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    // Keep track of the original page to redirect back after logging in
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Configure proxy matcher for clean execution path
export const config = {
  matcher: [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/dashboard/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/leads/:path*',
    '/pipeline/:path*',
    '/campaigns/:path*',
    '/analytics/:path*',
  ],
};
