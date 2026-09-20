import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAccessToken, ACCESS_TOKEN_COOKIE } from "@/lib/auth/token";
import { verifyPassword, hashPassword } from "@/lib/auth/password";

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate the admin from the access token cookie
    const token = req.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
    if (!token) {
      return NextResponse.json(
        { error: "You must be signed in to change your password." },
        { status: 401 }
      );
    }

    const payload = await verifyAccessToken(token);
    if (!payload?.id) {
      return NextResponse.json(
        { error: "Session expired. Please sign in again." },
        { status: 401 }
      );
    }

    // 2. Validate input fields
    const body = await req.json();
    const { currentPassword, newPassword, confirmPassword } = body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: "All password fields are required." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "New password and confirmation do not match." },
        { status: 400 }
      );
    }

    if (currentPassword === newPassword) {
      return NextResponse.json(
        { error: "New password cannot be the same as your current password." },
        { status: 400 }
      );
    }

    // 3. Find user in database
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    // 4. Verify current password
    const isCurrentValid = await verifyPassword(
      String(currentPassword),
      user.passwordHash
    );

    if (!isCurrentValid) {
      return NextResponse.json(
        { error: "Current password is incorrect." },
        { status: 400 }
      );
    }

    // 5. Hash new password and save to DB
    const newHash = await hashPassword(String(newPassword));
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newHash },
    });

    return NextResponse.json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while changing password." },
      { status: 500 }
    );
  }
}
