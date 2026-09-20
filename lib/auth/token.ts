import { SignJWT, jwtVerify } from "jose";

const secretKey = process.env.JWT_SECRET;
if (!secretKey) {
  throw new Error("Missing JWT_SECRET environment variable.");
}
const encodedSecret = new TextEncoder().encode(secretKey);

export interface TokenPayload {
  id: string;
  email: string;
  name?: string | null;
}

/**
 * Signs an Access JWT with 15-minute expiration using web-standard jose library.
 */
export async function signAccessToken(payload: TokenPayload): Promise<string> {
  return new SignJWT({ ...payload, type: "access" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(encodedSecret);
}

/**
 * Verifies an Access JWT and returns decoded payload, or null if invalid/expired.
 */
export async function verifyAccessToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, encodedSecret);
    return {
      id: payload.id as string,
      email: payload.email as string,
      name: (payload.name as string | null) ?? null,
    };
  } catch {
    return null;
  }
}

/**
 * Generates a 32-byte cryptographically secure random string using Web Crypto API.
 * Fully compatible with Edge Runtime, Node.js, and browser runtimes.
 */
export function generateRawRefreshToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Computes standard SHA-256 hash using Web Crypto API for secure database storage.
 * Fully compatible with Edge Runtime, Node.js, and browser runtimes.
 */
export async function hashToken(rawToken: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(rawToken);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Cookie configuration constants
export const ACCESS_TOKEN_COOKIE = "auth_token";
export const REFRESH_TOKEN_COOKIE = "refresh_token";

export const ACCESS_TOKEN_MAX_AGE = 15 * 60; // 15 minutes in seconds
export const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

// Backward compatibility aliases
export const signJwt = signAccessToken;
export const verifyJwt = verifyAccessToken;
