import { NextResponse } from "next/server"
import {
  getPatientCaseById,
  updatePatientCase,
  deletePatientCase,
} from "@/app/admin/gallery/patient/_services/patient-case.service"
import { patientCaseSchema } from "@/app/admin/gallery/patient/_schemas/patient-case.schema"

type Props = { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Props) {
  const { id } = await params
  const patientCase = await getPatientCaseById(id)
  if (!patientCase) {
    return NextResponse.json({ error: "Patient case not found" }, { status: 404 })
  }
  return NextResponse.json(patientCase)
}

export async function PUT(req: Request, { params }: Props) {
  try {
    const { id } = await params
    const body = await req.json()
    const parsed = patientCaseSchema.partial().safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
    }
    const updated = await updatePatientCase(id, parsed.data)
    if (!updated) {
      return NextResponse.json({ error: "Patient case not found" }, { status: 404 })
    }
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: "Failed to update patient case" }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: Props) {
  const { id } = await params
  const deleted = await deletePatientCase(id)
  if (!deleted) {
    return NextResponse.json({ error: "Patient case not found" }, { status: 404 })
  }
  return NextResponse.json({ success: true })
}
