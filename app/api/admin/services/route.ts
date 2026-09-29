import { NextRequest, NextResponse } from "next/server"
import { getServices, createService } from "@/server/services/service.service"
import { serviceSchema } from "@/domain/service/service.schema"
import { saveUploadedFile } from "@/server/lib/storage"
import { parseJsonField } from "@/server/lib/form-data"
import { requireAdmin } from "@/lib/auth/require-admin"

export async function GET() {
  const denied = await requireAdmin()
  if (denied) return denied

  try {
    const services = await getServices()
    return NextResponse.json(services)
  } catch (error) {
    console.error("GET /api/admin/services error:", error)
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin()
  if (denied) return denied

  try {
    let data: Record<string, any> = {}
    const contentType = req.headers.get("content-type") || ""

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData()
      const imageFile = formData.get("image")
      const secondaryImageFile = formData.get("secondaryImage")

      let imageUrl: string | null = null
      if (imageFile && typeof imageFile === "object" && "arrayBuffer" in imageFile && (imageFile as File).size > 0) {
        imageUrl = await saveUploadedFile(imageFile as File, "services")
      } else if (typeof imageFile === "string" && imageFile.trim()) {
        imageUrl = imageFile
      } else if (formData.has("existingImage")) {
        imageUrl = (formData.get("existingImage") as string) || null
      }

      let secondaryImageUrl: string | null = null
      if (secondaryImageFile && typeof secondaryImageFile === "object" && "arrayBuffer" in secondaryImageFile && (secondaryImageFile as File).size > 0) {
        secondaryImageUrl = await saveUploadedFile(secondaryImageFile as File, "services")
      } else if (typeof secondaryImageFile === "string" && secondaryImageFile.trim()) {
        secondaryImageUrl = secondaryImageFile
      } else if (formData.has("existingSecondaryImage")) {
        secondaryImageUrl = (formData.get("existingSecondaryImage") as string) || null
      }

      data = {
        name: formData.get("name"),
        slug: formData.get("slug") || null,
        description: formData.get("description") || null,
        details: formData.get("details") || null,
        status: formData.get("status") || "active",
        displayOrder: Number(formData.get("displayOrder")) || 1,
        showInHomePage: formData.get("showInHomePage") === "true",
        image: imageUrl,
        imageAlt: formData.get("imageAlt") || null,
        secondaryImage: secondaryImageUrl,
        secondaryImageAlt: formData.get("secondaryImageAlt") || null,
        metaTitle: formData.get("metaTitle") || null,
        metaDescription: formData.get("metaDescription") || null,
        faqs: parseJsonField(formData.get("faqs")),
      }
    } else {
      data = await req.json()
    }

    const parsed = serviceSchema.safeParse(data)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
    }
    const created = await createService(parsed.data)
    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    console.error("POST /api/admin/services error:", error)
    const message = error instanceof Error ? error.message : "Failed to create service"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
