import { NextRequest, NextResponse } from "next/server"
import {
  getServiceById,
  updateService,
  deleteService,
} from "@/server/services/service.service"
import { serviceSchema } from "@/domain/service/service.schema"
import { saveUploadedFile } from "@/server/lib/storage"
import { requireAdmin } from "@/lib/auth/require-admin"

type Props = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Props) {
  const denied = await requireAdmin()
  if (denied) return denied

  try {
    const { id } = await params
    const service = await getServiceById(id)
    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }
    return NextResponse.json(service)
  } catch (error) {
    console.error("GET /api/admin/services/[id] error:", error)
    return NextResponse.json({ error: "Failed to fetch service" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: Props) {
  const denied = await requireAdmin()
  if (denied) return denied

  try {
    const { id } = await params
    let data: Record<string, any> = {}
    const contentType = req.headers.get("content-type") || ""

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData()
      const imageFile = formData.get("image")
      const secondaryImageFile = formData.get("secondaryImage")

      let imageUrl: string | null | undefined = undefined
      if (imageFile && typeof imageFile === "object" && "arrayBuffer" in imageFile && (imageFile as File).size > 0) {
        imageUrl = await saveUploadedFile(imageFile as File, "services")
      } else if (typeof imageFile === "string" && imageFile.trim()) {
        imageUrl = imageFile
      } else if (formData.has("existingImage")) {
        imageUrl = (formData.get("existingImage") as string) || null
      }

      let secondaryImageUrl: string | null | undefined = undefined
      if (secondaryImageFile && typeof secondaryImageFile === "object" && "arrayBuffer" in secondaryImageFile && (secondaryImageFile as File).size > 0) {
        secondaryImageUrl = await saveUploadedFile(secondaryImageFile as File, "services")
      } else if (typeof secondaryImageFile === "string" && secondaryImageFile.trim()) {
        secondaryImageUrl = secondaryImageFile
      } else if (formData.has("existingSecondaryImage")) {
        secondaryImageUrl = (formData.get("existingSecondaryImage") as string) || null
      }

      data = {
        ...(formData.has("name") && { name: formData.get("name") }),
        ...(formData.has("slug") && { slug: formData.get("slug") || null }),
        ...(formData.has("description") && { description: formData.get("description") || null }),
        ...(formData.has("details") && { details: formData.get("details") || null }),
        ...(formData.has("status") && { status: formData.get("status") }),
        ...(formData.has("displayOrder") && { displayOrder: Number(formData.get("displayOrder")) || 1 }),
        ...(formData.has("showInHomePage") && { showInHomePage: formData.get("showInHomePage") === "true" }),
        ...(imageUrl !== undefined && { image: imageUrl }),
        ...(formData.has("imageAlt") && { imageAlt: formData.get("imageAlt") || null }),
        ...(secondaryImageUrl !== undefined && { secondaryImage: secondaryImageUrl }),
        ...(formData.has("secondaryImageAlt") && { secondaryImageAlt: formData.get("secondaryImageAlt") || null }),
      }
    } else {
      data = await req.json()
    }

    const parsed = serviceSchema.partial().safeParse(data)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
    }
    const updated = await updateService(id, parsed.data)
    if (!updated) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }
    return NextResponse.json(updated)
  } catch (error) {
    console.error("PUT /api/admin/services/[id] error:", error)
    const message = error instanceof Error ? error.message : "Failed to update service"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: Props) {
  const denied = await requireAdmin()
  if (denied) return denied

  try {
    const { id } = await params
    const deleted = await deleteService(id)
    if (!deleted) {
      return NextResponse.json({ error: "Service not found or failed to delete" }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/admin/services/[id] error:", error)
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 })
  }
}
