import { NextResponse } from "next/server"
import {
  getPatientCases,
  createPatientCase,
} from "@/server/services/patient-case.service"
import { patientCaseSchema } from "@/app/admin/gallery/patient/_schemas/patient-case.schema"
import { saveUploadedFile } from "@/server/lib/storage"
import { requireAdmin } from "@/lib/auth/require-admin"

export async function GET() {
  const denied = await requireAdmin()
  if (denied) return denied

  try {
    const cases = await getPatientCases()
    return NextResponse.json(cases)
  } catch (error) {
    console.error("GET /api/admin/gallery/patient error:", error)
    return NextResponse.json({ error: "Failed to fetch patient cases" }, { status: 500 })
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
      const beforeImageFile = formData.get("beforeImage")
      const afterImageFile = formData.get("afterImage")

      let beforeImageUrl: string | null = null
      if (beforeImageFile && typeof beforeImageFile === "object" && "arrayBuffer" in beforeImageFile && (beforeImageFile as File).size > 0) {
        beforeImageUrl = await saveUploadedFile(beforeImageFile as File, "patient-cases")
      } else if (typeof beforeImageFile === "string" && beforeImageFile.trim()) {
        beforeImageUrl = beforeImageFile
      } else if (formData.has("existingBeforeImage")) {
        beforeImageUrl = (formData.get("existingBeforeImage") as string) || null
      }

      let afterImageUrl: string | null = null
      if (afterImageFile && typeof afterImageFile === "object" && "arrayBuffer" in afterImageFile && (afterImageFile as File).size > 0) {
        afterImageUrl = await saveUploadedFile(afterImageFile as File, "patient-cases")
      } else if (typeof afterImageFile === "string" && afterImageFile.trim()) {
        afterImageUrl = afterImageFile
      } else if (formData.has("existingAfterImage")) {
        afterImageUrl = (formData.get("existingAfterImage") as string) || null
      }

      data = {
        heading: formData.get("heading"),
        description: formData.get("description") || null,
        beforeImage: beforeImageUrl,
        afterImage: afterImageUrl,
        beforeAlt: formData.get("beforeAlt"),
        afterAlt: formData.get("afterAlt"),
        displayOrder: Number(formData.get("displayOrder")) || 1,
      }
    } else {
      data = await req.json()
    }

    const parsed = patientCaseSchema.safeParse(data)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
    }
    const created = await createPatientCase(parsed.data)
    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    console.error("POST /api/admin/gallery/patient error:", error)
    const message = error instanceof Error ? error.message : "Failed to create patient case"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
