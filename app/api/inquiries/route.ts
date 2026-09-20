import { NextRequest, NextResponse } from "next/server";
import { getInquiries, createInquiry } from "@/server/services/inquiry.service";

export async function GET(req: NextRequest) {
  try {
    const searchParams =
      req.nextUrl?.searchParams ||
      new URL(req.url, "http://localhost").searchParams;

    const page = parseInt(
      searchParams.get("pageNumber") || searchParams.get("page") || "1",
      10
    );
    const pageSize = parseInt(
      searchParams.get("pageSize") || searchParams.get("limit") || "10",
      10
    );
    const search = searchParams.get("search") || "";
    const treatment = searchParams.get("treatment") || "";
    const from = searchParams.get("from") || "";
    const to = searchParams.get("to") || "";

    const result = await getInquiries({
      page,
      pageNumber: page,
      pageSize,
      limit: pageSize,
      search,
      treatment,
      from,
      to,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/inquiries error:", error);
    return NextResponse.json(
      { error: "Failed to fetch inquiries" },
      { status: 500 }
    );
  }
}

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
      status: body.status || "new",
    });

    return NextResponse.json(inquiry, { status: 201 });
  } catch (error) {
    console.error("POST /api/inquiries error:", error);
    return NextResponse.json(
      { error: "Failed to submit contact inquiry" },
      { status: 500 }
    );
  }
}
