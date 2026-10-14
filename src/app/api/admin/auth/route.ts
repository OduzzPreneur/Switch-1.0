import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, passkey } = await req.json();

    const expectedEmail = (process.env.ADMIN_EMAIL || 'admin@switch.ng').trim().toLowerCase();
    const expectedPasskey = process.env.ADMIN_PASSKEY || 'Switch2026@AdminSecured!';

    if (!email || !passkey) {
      return NextResponse.json(
        { success: false, message: 'Email and administrative passkey are required.' },
        { status: 400 }
      );
    }

    if (
      email.trim().toLowerCase() === expectedEmail &&
      passkey.trim() === expectedPasskey
    ) {
      return NextResponse.json({
        success: true,
        message: 'Administrative authentication successful.',
        admin: {
          email: expectedEmail,
          role: 'superadmin',
          authenticatedAt: new Date().toISOString(),
        },
      });
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
