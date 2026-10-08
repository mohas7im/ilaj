import { NextRequest, NextResponse } from "next/server"
import {
  getAnalyticsReport,
  ANALYTICS_RANGES,
  type AnalyticsRange,
} from "@/server/services/analytics.service"
import { requireAdmin } from "@/lib/auth/require-admin"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const denied = await requireAdmin()
  if (denied) return denied

  const days = Number(req.nextUrl.searchParams.get("days") ?? 28)
  const range = (ANALYTICS_RANGES as readonly number[]).includes(days)
    ? (days as AnalyticsRange)
    : 28

  try {
    const report = await getAnalyticsReport(range)
    return NextResponse.json(report)
  } catch (error) {
    console.error("GET /api/admin/analytics error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch analytics" },
      { status: 502 }
    )
  }
}
