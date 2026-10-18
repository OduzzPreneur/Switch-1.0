import { NextRequest, NextResponse } from 'next/server';
import { verifyPaystackPayment } from '@/lib/paystack';
import { generateRegistrationNumber, TOKEN_AMOUNT_KOBO } from '@/lib/security';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabase/admin';
import { COOKIE_STUDENT_TOKEN, signSession } from '@/lib/auth/session';

export async function POST(req: NextRequest) {
  try {
    const { reference, studentData } = await req.json();

    if (!reference) {
      return NextResponse.json(
        { success: false, message: 'Transaction reference is missing.' },
        { status: 400 }
      );
    }

    // Verify directly with Paystack API
    const verification = await verifyPaystackPayment(reference);

    if (!verification.status || verification.data?.status !== 'success') {
      return NextResponse.json(
        { success: false, message: 'Payment verification failed or transaction was abandoned.' },
        { status: 400 }
      );
    }

    // Validate that the paid amount equals the 5,000 NGN token
    if (verification.data.amount < TOKEN_AMOUNT_KOBO) {
      return NextResponse.json(
        { success: false, message: 'Paid amount does not match required ₦5,000 token.' },
        { status: 400 }
      );
    }

    // Generate unique verifiable Registration Number
    const registrationNumber = generateRegistrationNumber();

    // Extract metadata from Paystack verification response as a robust fallback
    const meta = verification.data.metadata || {};

    const registrationRecord = {
      fullName: studentData?.fullName || meta.fullName || verification.data.customer?.email?.split('@')[0],
      email: studentData?.email || meta.email || verification.data.customer?.email,
      phone: studentData?.phone || meta.phone || '',
      ageBracket: studentData?.ageBracket || meta.ageBracket || '21-25',
      gender: studentData?.gender || meta.gender || 'Prefer not to say',
      stateOfResidence: studentData?.stateOfResidence || meta.stateOfResidence || 'Lagos',
      trackId: studentData?.trackId || meta.trackId || 'web-development',
      learningMode: studentData?.learningMode || meta.learningMode || 'Online / Virtual',
      highestEducation: studentData?.highestEducation || meta.highestEducation || '',
      registrationNumber,
      paymentReference: reference,
      amountPaid: 5000,
      paymentStatus: 'verified',
      verifiedAt: new Date().toISOString(),
    };

    // Persist to Supabase cloud database if configured
    let userId: string | null = null;
    if (isSupabaseAdminConfigured && supabaseAdmin) {
      try {
        const studentEmail = registrationRecord.email.toLowerCase().trim();

        // 1. Check or create Auth User
        const { data: usersList } = await supabaseAdmin.auth.admin.listUsers();
        const existingAuthUser = usersList?.users?.find((u) => u.email?.toLowerCase() === studentEmail);

        if (existingAuthUser) {
          userId = existingAuthUser.id;
          if (studentData?.password) {
            await supabaseAdmin.auth.admin.updateUserById(userId, {
              password: studentData.password,
            });
          }
        } else {
          const { data: newAuthUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: studentEmail,
            password: studentData?.password || 'Switch1.0!Student',
            email_confirm: true,
            user_metadata: {
              full_name: registrationRecord.fullName,
              phone: registrationRecord.phone,
            },
          });
          if (!authError && newAuthUser?.user) {
            userId = newAuthUser.user.id;
          }
        }

        if (userId) {
          // 2. Upsert Student Profile
          await supabaseAdmin.from('profiles').upsert({
            id: userId,
            full_name: registrationRecord.fullName,
            email: studentEmail,
            phone: registrationRecord.phone,
            age_bracket: registrationRecord.ageBracket,
            gender: registrationRecord.gender,
            state_of_residence: registrationRecord.stateOfResidence,
            highest_education: registrationRecord.highestEducation,
            updated_at: new Date().toISOString(),
          });

          // 3. Insert Confirmed Registration Record
          const { data: regData } = await supabaseAdmin
            .from('registrations')
            .insert({
              user_id: userId,
              track_id: registrationRecord.trackId,
              learning_mode: registrationRecord.learningMode,
              status: 'confirmed',
              registration_number: registrationNumber,
            })
            .select('id')
            .single();

          // 4. Record Payment
          await supabaseAdmin.from('payments').insert({
            user_id: userId,
            registration_id: regData?.id,
            paystack_reference: reference,
            amount_kobo: verification.data.amount,
            currency: verification.data.currency || 'NGN',
            status: 'success',
            channel: verification.data.channel,
            paid_at: verification.data.paid_at || new Date().toISOString(),
            metadata: meta,
          });
        }
      } catch (dbErr) {
        console.error('Supabase persistence warning (non-fatal):', dbErr);
      }
    }

    const finalRegistration = {
      ...registrationRecord,
      id: userId || undefined,
    };

    // Sign a secure student session token so edge middleware and client are instantly logged in
    const token = await signSession({
      role: 'student',
      userId: userId || registrationRecord.email,
      email: registrationRecord.email,
      registrationNumber,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Payment verified and student enrollment confirmed.',
      registration: finalRegistration,
    });

    response.cookies.set(COOKIE_STUDENT_TOKEN, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Payment verification encountered a server error.' },
      { status: 500 }
    );
  }
}
