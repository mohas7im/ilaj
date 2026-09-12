import { NextResponse } from "next/server"
import {
  getClinicPhotos,
  createClinicPhoto,
} from "@/app/admin/gallery/clinic/_services/clinic-photo.service"
import { clinicPhotoSchema } from "@/app/admin/gallery/clinic/_schemas/clinic-photo.schema"

export async function GET() {
  const photos = await getClinicPhotos()
  return NextResponse.json(photos)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = clinicPhotoSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
    }
    const created = await createClinicPhoto(parsed.data)
    return NextResponse.json(created, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create clinic photo" }, { status: 500 })
  }
}
