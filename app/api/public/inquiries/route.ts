import { NextRequest, NextResponse, after } from "next/server";
import { createInquiry, updateInquiryEmailStatus } from "@/server/services/inquiry.service";
import { inquirySchema } from "@/domain/inquiry/inquiry.schema";
import { sendInquiryEmails } from "@/server/lib/send-inquiry-emails";

// Visitors can't choose a status; every new submission starts as "new".
const publicInquirySchema = inquirySchema.omit({ status: true });

// Public: the website contact form posts here without signing in.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Trim first so whitespace-only fields fail the "required" checks.
    const trimmed = Object.fromEntries(
      Object.entries(body ?? {}).map(([key, value]) => [
        key,
        typeof value === "string" ? value.trim() : value,
      ])
    );

    const parsed = publicInquirySchema.safeParse(trimmed);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const inquiry = await createInquiry({
      ...parsed.data,
      email: parsed.data.email.toLowerCase(),
      status: "new",
    });

    // Runs after the response (waitUntil on Workers). The inquiry is already saved,
    // so an email failure is only recorded on it — never surfaced to the visitor.
    after(async () => {
      let emailStatus: "sent" | "failed";
      try {
        const ok = await sendInquiryEmails({
          fullName: inquiry.fullName,
          email: inquiry.email,
          phone: inquiry.phone ?? "",
          treatment: inquiry.treatment,
          preferredDate: inquiry.preferredDate ?? null,
          preferredTime: inquiry.preferredTime ?? null,
          message: inquiry.message,
          type: inquiry.type,
        });
        emailStatus = ok ? "sent" : "failed";
      } catch (err) {
        console.error("[sendInquiryEmails]", err);
        emailStatus = "failed";
      }

      await updateInquiryEmailStatus(inquiry.id, emailStatus).catch((err) =>
        console.error("[updateInquiryEmailStatus]", err)
      );
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
