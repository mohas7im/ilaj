import { NextResponse } from "next/server"
import {
  getPatientCases,
  createPatientCase,
} from "@/app/admin/gallery/patient/_services/patient-case.service"
import { patientCaseSchema } from "@/app/admin/gallery/patient/_schemas/patient-case.schema"

export async function GET() {
  const cases = await getPatientCases()
  return NextResponse.json(cases)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = patientCaseSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
    }
    const created = await createPatientCase(parsed.data)
    return NextResponse.json(created, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create patient case" }, { status: 500 })
  }
}
