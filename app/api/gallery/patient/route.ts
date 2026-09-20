import { NextResponse } from "next/server"
import {
  getPatientCases,
  createPatientCase,
} from "@/server/services/patient-case.service"
import { patientCaseSchema } from "@/app/admin/gallery/patient/_schemas/patient-case.schema"

export async function GET() {
  try {
    const cases = await getPatientCases()
    return NextResponse.json(cases)
  } catch (error) {
    console.error("GET /api/gallery/patient error:", error)
    return NextResponse.json({ error: "Failed to fetch patient cases" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = patientCaseSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
    }
    const created = await createPatientCase(parsed.data)
    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    console.error("POST /api/gallery/patient error:", error)
    return NextResponse.json({ error: "Failed to create patient case" }, { status: 500 })
  }
}
