import { NextResponse } from "next/server"
import {
  getClinicPhotoById,
  updateClinicPhoto,
  deleteClinicPhoto,
} from "@/app/admin/gallery/clinic/_services/clinic-photo.service"
import { clinicPhotoSchema } from "@/app/admin/gallery/clinic/_schemas/clinic-photo.schema"

type Props = { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Props) {
  const { id } = await params
  const photo = await getClinicPhotoById(id)
  if (!photo) {
    return NextResponse.json({ error: "Clinic photo not found" }, { status: 404 })
  }
  return NextResponse.json(photo)
}

export async function PUT(req: Request, { params }: Props) {
  try {
    const { id } = await params
    const body = await req.json()
    const parsed = clinicPhotoSchema.partial().safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
    }
    const updated = await updateClinicPhoto(id, parsed.data)
    if (!updated) {
      return NextResponse.json({ error: "Clinic photo not found" }, { status: 404 })
    }
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: "Failed to update clinic photo" }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: Props) {
  const { id } = await params
  const deleted = await deleteClinicPhoto(id)
  if (!deleted) {
    return NextResponse.json({ error: "Clinic photo not found" }, { status: 404 })
  }
  return NextResponse.json({ success: true })
}
