import { NextResponse } from "next/server"
import {
  getClinicPhotos,
  createClinicPhoto,
} from "@/server/services/clinic-photo.service"
import { clinicPhotoSchema } from "@/app/admin/gallery/clinic/_schemas/clinic-photo.schema"

export async function GET() {
  try {
    const photos = await getClinicPhotos()
    return NextResponse.json(photos)
  } catch (error) {
    console.error("GET /api/gallery/clinic error:", error)
    return NextResponse.json({ error: "Failed to fetch clinic photos" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = clinicPhotoSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
    }
    const created = await createClinicPhoto(parsed.data)
    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    console.error("POST /api/gallery/clinic error:", error)
    return NextResponse.json({ error: "Failed to create clinic photo" }, { status: 500 })
  }
}
