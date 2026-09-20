import { NextResponse } from "next/server"
import { getClinicSettings, updateClinicSettings } from "@/server/services/settings.service"
import { settingsSchema } from "@/app/admin/settings/_schemas/settings.schema"

export async function GET() {
  try {
    const settings = await getClinicSettings()
    return NextResponse.json(settings)
  } catch (error) {
    console.error("GET /api/settings error:", error)
    return NextResponse.json(
      { error: "Failed to fetch clinic settings" },
      { status: 500 }
    )
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const parsed = settingsSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid settings data" },
        { status: 400 }
      )
    }
    const updated = await updateClinicSettings(parsed.data)
    return NextResponse.json(updated)
  } catch (error) {
    console.error("PUT /api/settings error:", error)
    return NextResponse.json(
      { error: "Failed to update clinic settings" },
      { status: 500 }
    )
  }
}
