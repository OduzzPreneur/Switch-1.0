// ==============================================================================
// SWITCH 1.0 SECURE SESSION MANAGEMENT (EDGE & NODE COMPATIBLE)
// Uses standard Web Crypto API (HMAC-SHA256) for signed, tamper-proof cookies
// ==============================================================================

export const COOKIE_ADMIN_TOKEN = 'switch_admin_token';
export const COOKIE_INSTRUCTOR_TOKEN = 'switch_inst_token';
export const COOKIE_STUDENT_TOKEN = 'switch_student_token';

// Default session expiration: 7 days
export const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

export interface SessionData {
  role: 'superadmin' | 'instructor' | 'student';
  userId: string;
  email: string;
  trackId?: string;
  fullName?: string;
  registrationNumber?: string;
  [key: string]: any;
}

export type SessionPayload = SessionData & {
  exp: number; // Unix timestamp in seconds
};

function getSessionSecret(): string {
  // Use dedicated SESSION_SECRET, fallback to ADMIN_PASSKEY or a derived deterministic fallback for dev
  return (
    process.env.SESSION_SECRET ||
    process.env.ADMIN_PASSKEY ||
    'switch-portal-secure-session-fallback-secret-2026'
  );
}

// Convert string to Uint8Array
function stringToUint8(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

// Base64URL encoder
function base64UrlEncode(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// Base64URL decoder
function base64UrlDecode(base64url: string): Uint8Array {
  let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4 !== 0) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function getHmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    stringToUint8(secret) as unknown as BufferSource,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

/**
 * Sign a payload object into a compact JWT-like signed token:
 * format: <base64url_payload>.<base64url_signature>
 */
export async function signSession(payload: SessionData, maxAgeSeconds = SESSION_MAX_AGE_SECONDS): Promise<string> {
  const fullPayload: SessionPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + maxAgeSeconds,
  };

  const payloadString = JSON.stringify(fullPayload);
  const encodedPayload = base64UrlEncode(stringToUint8(payloadString));

  const key = await getHmacKey(getSessionSecret());
  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    key,
    stringToUint8(encodedPayload) as unknown as BufferSource
  );

  const encodedSignature = base64UrlEncode(new Uint8Array(signatureBuffer));
  return `${encodedPayload}.${encodedSignature}`;
}

/**
 * Verify and unpack a signed session token. Returns null if invalid or expired.
 */
export async function verifySession(token: string | null | undefined): Promise<SessionPayload | null> {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [encodedPayload, encodedSignature] = parts;

  try {
    const key = await getHmacKey(getSessionSecret());
    const signatureBytes = base64UrlDecode(encodedSignature);

    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signatureBytes as unknown as BufferSource,
      stringToUint8(encodedPayload) as unknown as BufferSource
    );

    if (!isValid) return null;

    const payloadBytes = base64UrlDecode(encodedPayload);
    const payloadText = new TextDecoder().decode(payloadBytes);
    const payload: SessionPayload = JSON.parse(payloadText);

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null;
    }

    return payload;
  } catch (err) {
    return null;
  }
}

/**
 * Helper to inspect NextRequest cookies and return the caller's verified session & role
 */
export async function getAuthContext(req: { cookies: { get: (name: string) => { value: string } | undefined } }) {
  const adminToken = req.cookies.get(COOKIE_ADMIN_TOKEN)?.value;
  const adminSession = await verifySession(adminToken);
  if (adminSession && adminSession.role === 'superadmin') {
    return { role: 'admin' as const, session: adminSession };
  }

  const instToken = req.cookies.get(COOKIE_INSTRUCTOR_TOKEN)?.value;
  const instSession = await verifySession(instToken);
  if (instSession && instSession.role === 'instructor') {
    return { role: 'instructor' as const, session: instSession };
  }

  const studentToken = req.cookies.get(COOKIE_STUDENT_TOKEN)?.value;
  const studentSession = await verifySession(studentToken);
  if (studentSession && studentSession.role === 'student') {
    return { role: 'student' as const, session: studentSession };
  }

  return null;
}

