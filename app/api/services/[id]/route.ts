import { NextRequest, NextResponse } from "next/server"
import {
  getServiceById,
  updateService,
  deleteService,
} from "@/app/admin/services/_services/service.service"
import { serviceSchema } from "@/app/admin/services/_schemas/service.schema"

type Props = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Props) {
  try {
    const { id } = await params
    const service = await getServiceById(id)
    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }
    return NextResponse.json(service)
  } catch (error) {
    console.error("GET /api/services/[id] error:", error)
    return NextResponse.json({ error: "Failed to fetch service" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: Props) {
  try {
    const { id } = await params
    const body = await req.json()
    const parsed = serviceSchema.partial().safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
    }
    const updated = await updateService(id, parsed.data)
    if (!updated) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }
    return NextResponse.json(updated)
  } catch (error) {
    console.error("PUT /api/services/[id] error:", error)
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: Props) {
  try {
    const { id } = await params
    const deleted = await deleteService(id)
    if (!deleted) {
      return NextResponse.json({ error: "Service not found or failed to delete" }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/services/[id] error:", error)
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 })
  }
}
