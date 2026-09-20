import { NextResponse } from "next/server"
import { getDashboardStats } from "@/server/services/dashboard.service"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const stats = await getDashboardStats()
    return NextResponse.json(stats)
  } catch (error: any) {
    console.error("GET /api/dashboard/stats error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch dashboard statistics",
        errorMessage: error?.message || String(error),
        errorStack: error?.stack,
        errorName: error?.name,
      },
      { status: 500 }
    )
  }
}
