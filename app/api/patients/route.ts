import { NextResponse } from "next/server"
import { getPatients, createPatient } from "@/app/admin/patients/_services/patient.service"
import { patientSchema } from "@/app/admin/patients/_schemas/patient.schema"

export async function GET() {
  const patients = await getPatients()
  return NextResponse.json(patients)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = patientSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
    }
    const created = await createPatient(parsed.data)
    return NextResponse.json(created, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create patient" }, { status: 500 })
  }
}
