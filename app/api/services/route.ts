import { NextResponse } from "next/server"
import { getServices, createService } from "@/app/admin/services/_services/service.service"
import { serviceSchema } from "@/app/admin/services/_schemas/service.schema"

export async function GET() {
  const services = await getServices()
  return NextResponse.json(services)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = serviceSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
    }
    const created = await createService(parsed.data)
    return NextResponse.json(created, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 })
  }
}
