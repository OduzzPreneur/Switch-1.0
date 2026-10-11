import { NextRequest, NextResponse } from 'next/server';
import { verifyPaystackSignature } from '@/lib/security';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-paystack-signature');
    const secretKey = process.env.PAYSTACK_SECRET_KEY || '';

    // Cyber Defense: Strictly verify HMAC SHA-512 signature to prevent forged webhook attacks
    if (secretKey && !verifyPaystackSignature(rawBody, signature, secretKey)) {
      console.warn('Unauthorized webhook request rejected: Invalid Paystack signature.');
      return NextResponse.json(
        { error: 'Invalid HMAC signature' },
        { status: 401 }
      );
    }

    const event = JSON.parse(rawBody);

    if (event.event === 'charge.success') {
      const data = event.data;
      const reference = data.reference;
      const amount = data.amount;
      const customerEmail = data.customer?.email;

      console.log(`[Webhook Confirmed] Payment of ${amount} kobo received for ref: ${reference} from ${customerEmail}`);
      // Here Supabase database record can be updated with 'confirmed' status
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Paystack webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing error' },
      { status: 500 }
    );
  }
}
