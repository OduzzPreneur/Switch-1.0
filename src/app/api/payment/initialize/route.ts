import { NextRequest, NextResponse } from 'next/server';
import { initializePaystackPayment } from '@/lib/paystack';
import { TOKEN_AMOUNT_KOBO, generateRegistrationNumber, sanitizeInput } from '@/lib/security';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const fullName = sanitizeInput(body.fullName || '');
    const email = (body.email || '').trim().toLowerCase();
    const phone = sanitizeInput(body.phone || '');
    const trackId = body.trackId;
    const ageBracket = body.ageBracket;

    if (!fullName || !email || !phone || !trackId) {
      return NextResponse.json(
        { success: false, message: 'Missing required registration parameters.' },
        { status: 400 }
      );
    }

    // Verify age bracket meets the 15-40 requirement
    const allowedAges = ['15-20', '21-25', '26-30', '31-35', '36-40'];
    if (!allowedAges.includes(ageBracket)) {
      return NextResponse.json(
        { success: false, message: 'Target age must be between 15 and 40 years.' },
        { status: 400 }
      );
    }

    // Check for existing confirmed registration (Prevent double registration)
    if (isSupabaseAdminConfigured && supabaseAdmin) {
      const { data: existingProfile } = await supabaseAdmin
        .from('profiles')
        .select('id, full_name, email')
        .eq('email', email)
        .maybeSingle();

      if (existingProfile) {
        const { data: existingReg } = await supabaseAdmin
          .from('registrations')
          .select('id, registration_number, status')
          .eq('user_id', existingProfile.id)
          .maybeSingle();

        if (existingReg && existingReg.status === 'confirmed') {
          return NextResponse.json(
            {
              success: false,
              message: `A student with email "${email}" is already registered. Please sign in to your student portal.`,
              isAlreadyRegistered: true,
            },
            { status: 409 }
          );
        }
      }
    }

    const reference = `SW1_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const baseUrl = req.nextUrl.origin || 'http://localhost:3000';
    const callbackUrl = `${baseUrl}/register`;

    const paystackResult = await initializePaystackPayment({
      email,
      amountKobo: TOKEN_AMOUNT_KOBO,
      reference,
      callbackUrl,
      metadata: {
        fullName,
        phone,
        trackId,
        ageBracket,
        purpose: 'Switch 1.0 Youth Empowerment Token',
      },
    });

    return NextResponse.json({
      success: true,
      reference,
      data: paystackResult.data,
    });
  } catch (error: any) {
    console.error('Error in payment initialization:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Payment initiation failed.' },
      { status: 500 }
    );
  }
}
