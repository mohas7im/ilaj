import { NextResponse } from "next/server"
import { getDoctors, createDoctor } from "@/server/services/doctor.service"
import { doctorSchema } from "@/app/admin/doctors/_schemas/doctor.schema"

export async function GET() {
  try {
    const doctors = await getDoctors()
    return NextResponse.json(doctors)
  } catch (error) {
    console.error("GET /api/doctors error:", error)
    return NextResponse.json({ error: "Failed to fetch doctors" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = doctorSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
    }
    const created = await createDoctor(parsed.data)
    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    console.error("POST /api/doctors error:", error)
    return NextResponse.json({ error: "Failed to create doctor" }, { status: 500 })
  }
}

