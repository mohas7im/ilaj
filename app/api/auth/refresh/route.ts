import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  signAccessToken,
  generateRawRefreshToken,
  hashToken,
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_MAX_AGE,
} from "@/lib/auth/token";

export async function POST(req: NextRequest) {
  try {
    const rawRefreshToken = req.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

    if (!rawRefreshToken) {
      return NextResponse.json(
        { error: "No refresh token provided" },
        { status: 401 }
      );
    }

    // 1. Compute SHA-256 hash of the incoming token to query DB
    const tokenHash = await hashToken(rawRefreshToken);

    const existingToken = await prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!existingToken) {
      const response = NextResponse.json(
        { error: "Invalid refresh token" },
        { status: 401 }
      );
      response.cookies.delete(ACCESS_TOKEN_COOKIE);
      response.cookies.delete(REFRESH_TOKEN_COOKIE);
      return response;
    }

    // 2. Token Reuse / Theft Detection:
    // If a token that has ALREADY been revoked is presented again, someone stole it!
    if (existingToken.revokedAt) {
      console.warn(`[AUTH] Token reuse detected for user ${existingToken.userId}! Revoking all sessions.`);
      await prisma.refreshToken.updateMany({
        where: { userId: existingToken.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });

      const response = NextResponse.json(
        { error: "Security alert: Token reuse detected. Please log in again." },
        { status: 401 }
      );
      response.cookies.delete(ACCESS_TOKEN_COOKIE);
      response.cookies.delete(REFRESH_TOKEN_COOKIE);
      return response;
    }

    // 3. Expiration Check
    if (new Date() > existingToken.expiresAt) {
      const response = NextResponse.json(
        { error: "Refresh token expired" },
        { status: 401 }
      );
      response.cookies.delete(ACCESS_TOKEN_COOKIE);
      response.cookies.delete(REFRESH_TOKEN_COOKIE);
      return response;
    }

    // 4. Token Rotation: Revoke old token and generate a new pair
    await prisma.refreshToken.update({
      where: { id: existingToken.id },
      data: { revokedAt: new Date() },
    });

    // Generate fresh 15-minute Access Token
    const userPayload = {
      id: existingToken.user.id,
      email: existingToken.user.email,
      name: existingToken.user.name,
    };
    const newAccessToken = await signAccessToken(userPayload);

    // Generate fresh 7-day Refresh Token, hash it, and store in DB
    const newRawRefreshToken = generateRawRefreshToken();
    const newTokenHash = await hashToken(newRawRefreshToken);

    await prisma.refreshToken.create({
      data: {
        tokenHash: newTokenHash,
        userId: existingToken.userId,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_MAX_AGE * 1000),
      },
    });

    // 5. Return response with rotated cookies
    const response = NextResponse.json({
      success: true,
      message: "Tokens refreshed successfully",
      user: userPayload,
    });

    const isProd = process.env.NODE_ENV === "production";

    response.cookies.set(ACCESS_TOKEN_COOKIE, newAccessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: ACCESS_TOKEN_MAX_AGE,
    });

    response.cookies.set(REFRESH_TOKEN_COOKIE, newRawRefreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });

    return response;
  } catch (error) {
    console.error("Refresh token error:", error);
    return NextResponse.json(
      { error: "Failed to refresh authentication session" },
      { status: 500 }
    );
  }
}
