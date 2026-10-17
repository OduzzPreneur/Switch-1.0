import { NextRequest, NextResponse } from 'next/server';
import { COOKIE_ADMIN_TOKEN, signSession, verifySession } from '@/lib/auth/session';
import crypto from 'crypto';

function timingSafeMatch(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

// GET: Check active admin session from HTTP-only cookie
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(COOKIE_ADMIN_TOKEN)?.value;
    const session = await verifySession(token);

    if (!session || session.role !== 'superadmin') {
      return NextResponse.json({ success: false, message: 'Unauthenticated' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      admin: {
        email: session.email,
        role: 'superadmin',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST: Admin authentication
export async function POST(req: NextRequest) {
  try {
    const { email, passkey } = await req.json();

    const expectedEmail = (process.env.ADMIN_EMAIL || 'admin@switch.ng').trim().toLowerCase();
    const expectedPasskey = (process.env.ADMIN_PASSKEY || 'Switch2026@AdminSecured!').trim();

    if (!email || !passkey) {
      return NextResponse.json(
        { success: false, message: 'Email and administrative passkey are required.' },
        { status: 400 }
      );
    }

    const emailMatches = email.trim().toLowerCase() === expectedEmail;
    const passkeyMatches = timingSafeMatch(passkey.trim(), expectedPasskey);

    if (emailMatches && passkeyMatches) {
      // Sign secure session token
      const token = await signSession({
        role: 'superadmin',
        userId: expectedEmail,
        email: expectedEmail,
      });

      const response = NextResponse.json({
        success: true,
        message: 'Administrative authentication successful.',
        admin: {
          email: expectedEmail,
          role: 'superadmin',
          authenticatedAt: new Date().toISOString(),
        },
      });

      // Issue signed HTTP-only cookie
      response.cookies.set(COOKIE_ADMIN_TOKEN, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
      });

      return response;
    }

    return NextResponse.json(
      { success: false, message: 'Invalid administrative email or passkey.' },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Server error during administrative authentication.' },
      { status: 500 }
    );
  }
}

// DELETE: Admin logout
export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Administrative console signed out.' });
  response.cookies.set(COOKIE_ADMIN_TOKEN, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return response;
}
