import { NextResponse } from "next/server"
import { getSettings, updateSettings } from "@/app/admin/settings/_services/settings.service"
import { settingsSchema } from "@/app/admin/settings/_schemas/settings.schema"

export async function GET() {
  const settings = await getSettings()
  return NextResponse.json(settings)
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
    const updated = await updateSettings(parsed.data)
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}
