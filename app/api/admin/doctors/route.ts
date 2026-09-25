import { NextResponse } from "next/server"
import { getDoctors, createDoctor } from "@/server/services/doctor.service"
import { doctorSchema } from "@/domain/doctor/doctor.schema"
import { saveUploadedFile } from "@/server/lib/storage"
import { requireAdmin } from "@/lib/auth/require-admin"

export async function GET() {
  const denied = await requireAdmin()
  if (denied) return denied

  try {
    const doctors = await getDoctors()
    return NextResponse.json(doctors)
  } catch (error) {
    console.error("GET /api/admin/doctors error:", error)
    return NextResponse.json({ error: "Failed to fetch doctors" }, { status: 500 })
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
        imageUrl = await saveUploadedFile(imageFile as File, "doctors")
      } else if (typeof imageFile === "string" && imageFile.trim()) {
        imageUrl = imageFile
      } else if (formData.has("existingImage")) {
        imageUrl = (formData.get("existingImage") as string) || null
      }

      data = {
        name: formData.get("name"),
        designation: formData.get("designation"),
        specialization: formData.get("specialization"),
        bio: formData.get("bio") || "",
        image: imageUrl,
        imageAlt: formData.get("imageAlt") || null,
        isActive: formData.get("isActive") === "true",
        displayOrder: Number(formData.get("displayOrder")) || 1,
      }
    } else {
      data = await req.json()
    }

    const parsed = doctorSchema.safeParse(data)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
    }
    const created = await createDoctor(parsed.data)
    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    console.error("POST /api/admin/doctors error:", error)
    const message = error instanceof Error ? error.message : "Failed to create doctor"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
