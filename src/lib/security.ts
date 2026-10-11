import { z } from 'zod';
import crypto from 'crypto';

export const TOKEN_AMOUNT_NGN = 5000;
export const TOKEN_AMOUNT_KOBO = 500000;
export const TOKEN_CURRENCY = 'NGN';

// Strict input sanitization against XSS & script injection
export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .trim()
    .replace(/[<>]/g, '') // strip dangerous bracket characters
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '');
}

// Zod schema for Student Registration Validation
export const registrationSchema = z.object({
  fullName: z
    .string()
    .min(3, 'Full name must be at least 3 characters')
    .max(100, 'Full name cannot exceed 100 characters')
    .transform(sanitizeInput),
  email: z
    .string()
    .email('Please provide a valid email address')
    .max(120)
    .toLowerCase()
    .trim(),
  phone: z
    .string()
    .min(10, 'Please enter a valid phone number')
    .max(16, 'Phone number too long')
    .regex(/^[+0-9\s-]+$/, 'Phone number must contain only numbers and standard symbols')
    .transform(sanitizeInput),
  ageBracket: z.enum(['15-20', '21-25', '26-30', '31-35', '36-40'], {
    errorMap: () => ({ message: 'You must be between 15 and 40 years old to qualify.' }),
  }),
  gender: z.enum(['Male', 'Female', 'Prefer not to say']),
  stateOfResidence: z
    .string()
    .min(2, 'Please specify your state of residence')
    .max(50)
    .transform(sanitizeInput),
  learningMode: z.enum(['Online / Virtual', 'Physical Center / Hybrid']),
  trackId: z.string().min(2, 'Please select your preferred track'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100)
    .optional(),
});

export type RegistrationFormData = z.infer<typeof registrationSchema>;

// Paystack HMAC SHA-512 Webhook Signature Validator
export function verifyPaystackSignature(
  rawBody: string,
  signatureHeader: string | null,
  secretKey: string
): boolean {
  if (!signatureHeader || !secretKey) return false;
  try {
    const hash = crypto
      .createHmac('sha512', secretKey)
      .update(rawBody)
      .digest('hex');
    return crypto.timingSafeEqual(
      Buffer.from(hash, 'utf-8'),
      Buffer.from(signatureHeader, 'utf-8')
    );
  } catch (error) {
    console.error('Error verifying Paystack signature:', error);
    return false;
  }
}

// Cryptographically secure Registration ID Generator
export function generateRegistrationNumber(): string {
  const year = new Date().getFullYear();
  const randomSuffix = crypto.randomInt(10000, 99999);
  return `SW1-${year}-${randomSuffix}`;
}
