import { NextRequest, NextResponse } from "next/server";
import { getInquiries } from "@/server/services/inquiry.service";
import { requireAdmin } from "@/lib/auth/require-admin";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { searchParams } = req.nextUrl;

    const pageNumber = parseInt(searchParams.get("pageNumber") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
    const search = searchParams.get("search") || "";
    const treatment = searchParams.get("treatment") || "";
    const from = searchParams.get("from") || "";
    const to = searchParams.get("to") || "";

    const result = await getInquiries({
      pageNumber,
      pageSize,
      search,
      treatment,
      from,
      to,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/admin/inquiries error:", error);
    return NextResponse.json(
      { error: "Failed to fetch inquiries" },
      { status: 500 }
    );
  }
}
