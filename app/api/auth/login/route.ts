import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { signJwt } from "@/lib/auth/token";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    // 1. Look up user by unique email
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // 2. Verify bcrypt password hash
    const isValid = await verifyPassword(String(password), user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // 3. Generate signed JWT token
    const token = await signJwt({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    // 4. Create standard JSON response (session handled securely via HttpOnly cookie)
    const response = NextResponse.json({
      success: true,
      message: "Logged in successfully",
      user: {
        name: user.name,
        email: user.email,
      },
    });

    // 5. Attach HttpOnly secure cookie for web browser session
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
