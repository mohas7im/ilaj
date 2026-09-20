import { NextRequest, NextResponse } from "next/server"
import { getServices, createService } from "@/server/services/service.service"
import { serviceSchema } from "@/app/admin/services/_schemas/service.schema"

export async function GET() {
  try {
    const services = await getServices()
    return NextResponse.json(services)
  } catch (error) {
    console.error("GET /api/services error:", error)
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = serviceSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
    }
    const created = await createService(parsed.data)
    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    console.error("POST /api/services error:", error)
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 })
  }
}
