import { NextRequest, NextResponse } from 'next/server';
import { verifyPaystackPayment } from '@/lib/paystack';
import { generateRegistrationNumber, TOKEN_AMOUNT_KOBO } from '@/lib/security';

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

    const registrationRecord = {
      fullName: studentData?.fullName || verification.data.customer?.email?.split('@')[0],
      email: studentData?.email || verification.data.customer?.email,
      phone: studentData?.phone || '',
      ageBracket: studentData?.ageBracket || '21-25',
      trackId: studentData?.trackId || 'software-engineering',
      learningMode: studentData?.learningMode || 'Online / Virtual',
      registrationNumber,
      paymentReference: reference,
      amountPaid: 5000,
      paymentStatus: 'verified',
      verifiedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: 'Payment verified and student enrollment confirmed.',
      registration: registrationRecord,
    });
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Payment verification encountered a server error.' },
      { status: 500 }
    );
  }
}
