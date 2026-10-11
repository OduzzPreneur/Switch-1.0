import { TOKEN_AMOUNT_KOBO, TOKEN_CURRENCY } from './security';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || '';
export const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '';

export interface PaystackInitResponse {
  status: boolean;
  message: string;
  data?: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data?: {
    id: number;
    status: string;
    reference: string;
    amount: number;
    currency: string;
    paid_at: string;
    channel: string;
    customer: {
      email: string;
      customer_code?: string;
    };
    metadata?: Record<string, any>;
  };
}

// Initialize payment directly on Paystack Gateway
export async function initializePaystackPayment(params: {
  email: string;
  amountKobo?: number;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, any>;
}): Promise<PaystackInitResponse> {
  const amount = params.amountKobo || TOKEN_AMOUNT_KOBO;

  if (!PAYSTACK_SECRET_KEY) {
    throw new Error('Paystack secret key is not configured. Please set PAYSTACK_SECRET_KEY in your environment variables.');
  }

  const response = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: params.email,
      amount,
      currency: TOKEN_CURRENCY,
      reference: params.reference,
      callback_url: params.callbackUrl,
      metadata: params.metadata,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Paystack initialization failed: ${errorText}`);
  }

  return response.json();
}

// Strictly verify payment on Paystack server
export async function verifyPaystackPayment(
  reference: string
): Promise<PaystackVerifyResponse> {
  if (!PAYSTACK_SECRET_KEY) {
    throw new Error('Paystack secret key is not configured. Please set PAYSTACK_SECRET_KEY in your environment variables.');
  }

  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Paystack verification failed: ${errText}`);
  }

  return response.json();
}
