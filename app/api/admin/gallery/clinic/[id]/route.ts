import { NextResponse } from "next/server"
import {
  getClinicPhotoById,
  updateClinicPhoto,
  deleteClinicPhoto,
} from "@/server/services/clinic-photo.service"
import { clinicPhotoSchema } from "@/domain/clinic-photo/clinic-photo.schema"
import { saveUploadedFile } from "@/server/lib/storage"
import { requireAdmin } from "@/lib/auth/require-admin"

type Props = { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Props) {
  const denied = await requireAdmin()
  if (denied) return denied

  try {
    const { id } = await params
    const photo = await getClinicPhotoById(id)
    if (!photo) {
      return NextResponse.json({ error: "Clinic photo not found" }, { status: 404 })
    }
    return NextResponse.json(photo)
  } catch (error) {
    console.error("GET /api/admin/gallery/clinic/[id] error:", error)
    return NextResponse.json({ error: "Failed to fetch clinic photo" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: Props) {
  const denied = await requireAdmin()
  if (denied) return denied

  try {
    const { id } = await params
    let data: Record<string, any> = {}
    const contentType = req.headers.get("content-type") || ""

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData()
      const imageFile = formData.get("image")

      let imageUrl: string | null | undefined = undefined
      if (imageFile && typeof imageFile === "object" && "arrayBuffer" in imageFile && (imageFile as File).size > 0) {
        imageUrl = await saveUploadedFile(imageFile as File, "clinic-photos")
      } else if (typeof imageFile === "string" && imageFile.trim()) {
        imageUrl = imageFile
      } else if (formData.has("existingImage")) {
        imageUrl = (formData.get("existingImage") as string) || null
      }

      data = {
        ...(formData.has("heading") && { heading: formData.get("heading") }),
        ...(formData.has("description") && { description: formData.get("description") || null }),
        ...(imageUrl !== undefined && { image: imageUrl }),
        ...(formData.has("alt") && { alt: formData.get("alt") }),
        ...(formData.has("displayOrder") && { displayOrder: Number(formData.get("displayOrder")) || 1 }),
      }
    } else {
      data = await req.json()
    }

    const parsed = clinicPhotoSchema.partial().safeParse(data)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
    }
    const updated = await updateClinicPhoto(id, parsed.data)
    if (!updated) {
      return NextResponse.json({ error: "Clinic photo not found" }, { status: 404 })
    }
    return NextResponse.json(updated)
  } catch (error) {
    console.error("PUT /api/admin/gallery/clinic/[id] error:", error)
    const message = error instanceof Error ? error.message : "Failed to update clinic photo"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: Props) {
  const denied = await requireAdmin()
  if (denied) return denied

  try {
    const { id } = await params
    const deleted = await deleteClinicPhoto(id)
    if (!deleted) {
      return NextResponse.json({ error: "Clinic photo not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/admin/gallery/clinic/[id] error:", error)
    return NextResponse.json({ error: "Failed to delete clinic photo" }, { status: 500 })
  }
}
