import { NextRequest, NextResponse } from "next/server"
import { getAnalyticsReport, isValidRange } from "@/server/services/analytics.service"
import { requireAdmin } from "@/lib/auth/require-admin"

export const dynamic = "force-dynamic"

// GET /api/admin/analytics?start=YYYY-MM-DD&end=YYYY-MM-DD (inclusive)
export async function GET(req: NextRequest) {
  const denied = await requireAdmin()
  if (denied) return denied

  const start = req.nextUrl.searchParams.get("start") ?? ""
  const end = req.nextUrl.searchParams.get("end") ?? ""
  if (!isValidRange(start, end)) {
    return NextResponse.json({ error: "Invalid date range" }, { status: 400 })
  }

  try {
    const report = await getAnalyticsReport(start, end)
    return NextResponse.json(report)
  } catch (error) {
    console.error("GET /api/admin/analytics error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch analytics" },
      { status: 502 }
    )
  }
}
