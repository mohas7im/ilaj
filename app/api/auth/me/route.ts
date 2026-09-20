import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: {
        name: session.user.name || "Admin",
        email: session.user.email || "",
      },
    });
  } catch (error) {
    console.error("Auth session error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
