import { NextRequest, NextResponse } from "next/server";
import { createInquiry } from "@/server/services/inquiry.service";

// Public: the website contact form posts here without signing in.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const fullName = body.fullName?.trim();
    const email = body.email?.trim()?.toLowerCase();
    const treatment = body.treatment?.trim();
    const message = body.message?.trim();
    const phone = body.phone?.trim() || null;
    const preferredDate = body.preferredDate?.trim() || null;
    const preferredTime = body.preferredTime?.trim() || null;

    if (!fullName) {
      return NextResponse.json({ error: "Full name is required." }, { status: 400 });
    }
    if (!email) {
      return NextResponse.json({ error: "Email address is required." }, { status: 400 });
    }
    if (!treatment) {
      return NextResponse.json({ error: "Treatment selection is required." }, { status: 400 });
    }
    if (!message) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    const inquiry = await createInquiry({
      fullName,
      email,
      phone,
      treatment,
      preferredDate,
      preferredTime,
      message,
      // Visitors can't choose a status; every new submission starts as "new".
      status: "new",
    });

    // Return only the id so the visitor's submission isn't echoed back in full.
    return NextResponse.json({ id: inquiry.id }, { status: 201 });
  } catch (error) {
    console.error("POST /api/public/inquiries error:", error);
    return NextResponse.json(
      { error: "Failed to submit contact inquiry" },
      { status: 500 }
    );
  }
}
