import { NextResponse } from "next/server"
import {
  getServiceById,
  updateService,
  deleteService,
} from "@/app/admin/services/_services/service.service"
import { serviceSchema } from "@/app/admin/services/_schemas/service.schema"

type Props = { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Props) {
  const { id } = await params
  const service = await getServiceById(id)
  if (!service) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 })
  }
  return NextResponse.json(service)
}

export async function PUT(req: Request, { params }: Props) {
  try {
    const { id } = await params
    const body = await req.json()
    const parsed = serviceSchema.partial().safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
    }
    const updated = await updateService(id, parsed.data)
    if (!updated) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: Props) {
  const { id } = await params
  const deleted = await deleteService(id)
  if (!deleted) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 })
  }
  return NextResponse.json({ success: true })
}
