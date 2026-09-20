import { NextResponse } from "next/server"
import {
  getPatientCaseById,
  updatePatientCase,
  deletePatientCase,
} from "@/server/services/patient-case.service"
import { patientCaseSchema } from "@/app/admin/gallery/patient/_schemas/patient-case.schema"
import { saveUploadedFile } from "@/server/lib/storage"

type Props = { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Props) {
  try {
    const { id } = await params
    const patientCase = await getPatientCaseById(id)
    if (!patientCase) {
      return NextResponse.json({ error: "Patient case not found" }, { status: 404 })
    }
    return NextResponse.json(patientCase)
  } catch (error) {
    console.error("GET /api/gallery/patient/[id] error:", error)
    return NextResponse.json({ error: "Failed to fetch patient case" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: Props) {
  try {
    const { id } = await params
    let data: Record<string, any> = {}
    const contentType = req.headers.get("content-type") || ""

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData()
      const beforeImageFile = formData.get("beforeImage")
      const afterImageFile = formData.get("afterImage")

      let beforeImageUrl: string | null | undefined = undefined
      if (beforeImageFile && typeof beforeImageFile === "object" && "arrayBuffer" in beforeImageFile && (beforeImageFile as File).size > 0) {
        beforeImageUrl = await saveUploadedFile(beforeImageFile as File, "patient-cases")
      } else if (typeof beforeImageFile === "string" && beforeImageFile.trim()) {
        beforeImageUrl = beforeImageFile
      } else if (formData.has("existingBeforeImage")) {
        beforeImageUrl = (formData.get("existingBeforeImage") as string) || null
      }

      let afterImageUrl: string | null | undefined = undefined
      if (afterImageFile && typeof afterImageFile === "object" && "arrayBuffer" in afterImageFile && (afterImageFile as File).size > 0) {
        afterImageUrl = await saveUploadedFile(afterImageFile as File, "patient-cases")
      } else if (typeof afterImageFile === "string" && afterImageFile.trim()) {
        afterImageUrl = afterImageFile
      } else if (formData.has("existingAfterImage")) {
        afterImageUrl = (formData.get("existingAfterImage") as string) || null
      }

      data = {
        ...(formData.has("heading") && { heading: formData.get("heading") }),
        ...(formData.has("description") && { description: formData.get("description") || null }),
        ...(beforeImageUrl !== undefined && { beforeImage: beforeImageUrl }),
        ...(afterImageUrl !== undefined && { afterImage: afterImageUrl }),
        ...(formData.has("beforeAlt") && { beforeAlt: formData.get("beforeAlt") }),
        ...(formData.has("afterAlt") && { afterAlt: formData.get("afterAlt") }),
        ...(formData.has("displayOrder") && { displayOrder: Number(formData.get("displayOrder")) || 1 }),
      }
    } else {
      data = await req.json()
    }

    const parsed = patientCaseSchema.partial().safeParse(data)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
    }
    const updated = await updatePatientCase(id, parsed.data)
    if (!updated) {
      return NextResponse.json({ error: "Patient case not found" }, { status: 404 })
    }
    return NextResponse.json(updated)
  } catch (error) {
    console.error("PUT /api/gallery/patient/[id] error:", error)
    const message = error instanceof Error ? error.message : "Failed to update patient case"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: Props) {
  try {
    const { id } = await params
    const deleted = await deletePatientCase(id)
    if (!deleted) {
      return NextResponse.json({ error: "Patient case not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/gallery/patient/[id] error:", error)
    return NextResponse.json({ error: "Failed to delete patient case" }, { status: 500 })
  }
}
