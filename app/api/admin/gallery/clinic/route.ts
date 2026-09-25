import { NextResponse } from "next/server"
import {
  getClinicPhotos,
  createClinicPhoto,
} from "@/server/services/clinic-photo.service"
import { clinicPhotoSchema } from "@/app/admin/gallery/clinic/_schemas/clinic-photo.schema"
import { saveUploadedFile } from "@/server/lib/storage"
import { requireAdmin } from "@/lib/auth/require-admin"

export async function GET() {
  const denied = await requireAdmin()
  if (denied) return denied

  try {
    const photos = await getClinicPhotos()
    return NextResponse.json(photos)
  } catch (error) {
    console.error("GET /api/admin/gallery/clinic error:", error)
    return NextResponse.json({ error: "Failed to fetch clinic photos" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const denied = await requireAdmin()
  if (denied) return denied

  try {
    let data: Record<string, any> = {}
    const contentType = req.headers.get("content-type") || ""

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData()
      const imageFile = formData.get("image")

      let imageUrl: string | null = null
      if (imageFile && typeof imageFile === "object" && "arrayBuffer" in imageFile && (imageFile as File).size > 0) {
        imageUrl = await saveUploadedFile(imageFile as File, "clinic-photos")
      } else if (typeof imageFile === "string" && imageFile.trim()) {
        imageUrl = imageFile
      } else if (formData.has("existingImage")) {
        imageUrl = (formData.get("existingImage") as string) || null
      }

      data = {
        heading: formData.get("heading"),
        description: formData.get("description") || null,
        image: imageUrl,
        alt: formData.get("alt"),
        displayOrder: Number(formData.get("displayOrder")) || 1,
      }
    } else {
      data = await req.json()
    }

    const parsed = clinicPhotoSchema.safeParse(data)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
    }
    const created = await createClinicPhoto(parsed.data)
    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    console.error("POST /api/admin/gallery/clinic error:", error)
    const message = error instanceof Error ? error.message : "Failed to create clinic photo"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
