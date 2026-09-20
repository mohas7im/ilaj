import { NextResponse } from "next/server"
import {
  getClinicPhotoById,
  updateClinicPhoto,
  deleteClinicPhoto,
} from "@/server/services/clinic-photo.service"
import { clinicPhotoSchema } from "@/app/admin/gallery/clinic/_schemas/clinic-photo.schema"

type Props = { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Props) {
  try {
    const { id } = await params
    const photo = await getClinicPhotoById(id)
    if (!photo) {
      return NextResponse.json({ error: "Clinic photo not found" }, { status: 404 })
    }
    return NextResponse.json(photo)
  } catch (error) {
    console.error("GET /api/gallery/clinic/[id] error:", error)
    return NextResponse.json({ error: "Failed to fetch clinic photo" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: Props) {
  try {
    const { id } = await params
    const body = await req.json()
    const parsed = clinicPhotoSchema.partial().safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
    }
    const updated = await updateClinicPhoto(id, parsed.data)
    if (!updated) {
      return NextResponse.json({ error: "Clinic photo not found" }, { status: 404 })
    }
    return NextResponse.json(updated)
  } catch (error) {
    console.error("PUT /api/gallery/clinic/[id] error:", error)
    return NextResponse.json({ error: "Failed to update clinic photo" }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: Props) {
  try {
    const { id } = await params
    const deleted = await deleteClinicPhoto(id)
    if (!deleted) {
      return NextResponse.json({ error: "Clinic photo not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/gallery/clinic/[id] error:", error)
    return NextResponse.json({ error: "Failed to delete clinic photo" }, { status: 500 })
  }
}
