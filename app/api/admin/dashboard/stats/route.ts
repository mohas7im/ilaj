import { NextResponse } from "next/server"
import { getDashboardStats } from "@/server/services/dashboard.service"
import { requireAdmin } from "@/lib/auth/require-admin"

export const dynamic = "force-dynamic"

export async function GET() {
  const denied = await requireAdmin()
  if (denied) return denied

  try {
    const stats = await getDashboardStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error("GET /api/admin/dashboard/stats error:", error)
    return NextResponse.json(
      { error: "Failed to fetch dashboard statistics" },
      { status: 500 }
    )
  }
}
