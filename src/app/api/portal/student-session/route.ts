import { NextRequest, NextResponse } from 'next/server';
import { COOKIE_STUDENT_TOKEN, signSession } from '@/lib/auth/session';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const { userId, email, registrationNumber } = await req.json();

    if (!email) {
      return NextResponse.json({ success: false, message: 'Email required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Sign a secure student session token
    const token = await signSession({
      role: 'student',
      userId: userId || cleanEmail,
      email: cleanEmail,
      registrationNumber: registrationNumber || '',
    });

    const response = NextResponse.json({ success: true });
    response.cookies.set(COOKIE_STUDENT_TOKEN, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(COOKIE_STUDENT_TOKEN, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return response;
}
