import { NextResponse } from "next/server"
import {
  getPatientById,
  updatePatient,
  deletePatient,
} from "@/app/admin/patients/_services/patient.service"
import { patientSchema } from "@/app/admin/patients/_schemas/patient.schema"

type Props = { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Props) {
  const { id } = await params
  const patient = await getPatientById(id)
  if (!patient) {
    return NextResponse.json({ error: "Patient not found" }, { status: 404 })
  }
  return NextResponse.json(patient)
}

export async function PUT(req: Request, { params }: Props) {
  try {
    const { id } = await params
    const body = await req.json()
    const parsed = patientSchema.partial().safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
    }
    const updated = await updatePatient(id, parsed.data)
    if (!updated) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 })
    }
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: "Failed to update patient" }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: Props) {
  const { id } = await params
  const deleted = await deletePatient(id)
  if (!deleted) {
    return NextResponse.json({ error: "Patient not found" }, { status: 404 })
  }
  return NextResponse.json({ success: true })
}
