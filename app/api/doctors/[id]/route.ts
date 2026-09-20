import { NextResponse } from "next/server"
import {
  getDoctorById,
  updateDoctor,
  deleteDoctor,
} from "@/server/services/doctor.service"
import { doctorSchema } from "@/app/admin/doctors/_schemas/doctor.schema"
import { saveUploadedFile } from "@/server/lib/storage"

type Props = { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Props) {
  try {
    const { id } = await params
    const doctor = await getDoctorById(id)
    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 })
    }
    return NextResponse.json(doctor)
  } catch (error) {
    console.error("GET /api/doctors/[id] error:", error)
    return NextResponse.json({ error: "Failed to fetch doctor" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: Props) {
  try {
    const { id } = await params
    let data: Record<string, any> = {}
    const contentType = req.headers.get("content-type") || ""

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData()
      const imageFile = formData.get("image")

      let imageUrl: string | null | undefined = undefined
      if (imageFile && typeof imageFile === "object" && "arrayBuffer" in imageFile && (imageFile as File).size > 0) {
        imageUrl = await saveUploadedFile(imageFile as File, "doctors")
      } else if (typeof imageFile === "string" && imageFile.trim()) {
        imageUrl = imageFile
      } else if (formData.has("existingImage")) {
        imageUrl = (formData.get("existingImage") as string) || null
      }

      data = {
        ...(formData.has("name") && { name: formData.get("name") }),
        ...(formData.has("designation") && { designation: formData.get("designation") }),
        ...(formData.has("specialization") && { specialization: formData.get("specialization") }),
        ...(formData.has("bio") && { bio: formData.get("bio") || "" }),
        ...(imageUrl !== undefined && { image: imageUrl }),
        ...(formData.has("imageAlt") && { imageAlt: formData.get("imageAlt") || null }),
        ...(formData.has("isActive") && { isActive: formData.get("isActive") === "true" }),
        ...(formData.has("displayOrder") && { displayOrder: Number(formData.get("displayOrder")) || 1 }),
      }
    } else {
      data = await req.json()
    }

    const parsed = doctorSchema.partial().safeParse(data)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
    }
    const updated = await updateDoctor(id, parsed.data)
    if (!updated) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 })
    }
    return NextResponse.json(updated)
  } catch (error) {
    console.error("PUT /api/doctors/[id] error:", error)
    const message = error instanceof Error ? error.message : "Failed to update doctor"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: Props) {
  try {
    const { id } = await params
    const deleted = await deleteDoctor(id)
    if (!deleted) {
      return NextResponse.json({ error: "Doctor not found or failed to delete" }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/doctors/[id] error:", error)
    return NextResponse.json({ error: "Failed to delete doctor" }, { status: 500 })
  }
}
