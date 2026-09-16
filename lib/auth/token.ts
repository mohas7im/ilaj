import { SignJWT, jwtVerify } from "jose";

const secretKey = process.env.JWT_SECRET || process.env.AUTH_SECRET || "ilaj-dental-clinic-jwt-secret-key-super-secure-2026";
const encodedSecret = new TextEncoder().encode(secretKey);

export interface TokenPayload {
  id: string;
  email: string;
  name?: string | null;
}

/**
 * Signs a JWT with 7-day expiration using web-standard jose library.
 */
export async function signJwt(payload: TokenPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedSecret);
}

/**
 * Verifies a JWT and returns the decoded payload, or null if invalid/expired.
 */
export async function verifyJwt(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, encodedSecret);
    return payload as unknown as TokenPayload;
  } catch {
    return null;
  }
}
