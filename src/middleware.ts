import { NextRequest, NextResponse } from 'next/server';
import {
  COOKIE_ADMIN_TOKEN,
  COOKIE_INSTRUCTOR_TOKEN,
  COOKIE_STUDENT_TOKEN,
  verifySession,
} from '@/lib/auth/session';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. ADMIN ROUTE PROTECTION
  if (pathname.startsWith('/admin')) {
    // Whitelist login route
    if (pathname === '/admin/login') {
      const adminToken = request.cookies.get(COOKIE_ADMIN_TOKEN)?.value;
      const adminSession = await verifySession(adminToken);
      if (adminSession && adminSession.role === 'superadmin') {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return NextResponse.next();
    }

    const adminToken = request.cookies.get(COOKIE_ADMIN_TOKEN)?.value;
    const adminSession = await verifySession(adminToken);

    if (!adminSession || adminSession.role !== 'superadmin') {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      const res = NextResponse.redirect(loginUrl);
      // Clean up invalid cookie if present
      if (adminToken) {
        res.cookies.delete(COOKIE_ADMIN_TOKEN);
      }
      return res;
    }

    return NextResponse.next();
  }

  // 2. INSTRUCTOR ROUTE PROTECTION
  if (pathname.startsWith('/instructor')) {
    // Whitelist instructor login route
    if (pathname === '/instructor/login') {
      const instToken = request.cookies.get(COOKIE_INSTRUCTOR_TOKEN)?.value;
      const instSession = await verifySession(instToken);
      if (instSession && instSession.role === 'instructor') {
        return NextResponse.redirect(new URL('/instructor', request.url));
      }
      return NextResponse.next();
    }

    const instToken = request.cookies.get(COOKIE_INSTRUCTOR_TOKEN)?.value;
    const instSession = await verifySession(instToken);

    if (!instSession || instSession.role !== 'instructor') {
      const loginUrl = new URL('/instructor/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      const res = NextResponse.redirect(loginUrl);
      if (instToken) {
        res.cookies.delete(COOKIE_INSTRUCTOR_TOKEN);
      }
      return res;
    }

    return NextResponse.next();
  }

  // 3. STUDENT DASHBOARD ROUTE PROTECTION
  if (pathname.startsWith('/dashboard')) {
    const studentToken = request.cookies.get(COOKIE_STUDENT_TOKEN)?.value;
    const studentSession = await verifySession(studentToken);

    // Also check for standard Supabase auth cookie chunks (e.g. sb-*-auth-token)
    const hasSupabaseCookie = request.cookies
      .getAll()
      .some((c) => c.name.startsWith('sb-') && c.name.includes('-auth-token'));

    if (!studentSession && !hasSupabaseCookie) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      const res = NextResponse.redirect(loginUrl);
      if (studentToken) {
        res.cookies.delete(COOKIE_STUDENT_TOKEN);
      }
      return res;
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/instructor/:path*',
    '/dashboard/:path*',
  ],
};
