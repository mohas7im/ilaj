import { NextResponse } from "next/server"
import { getDoctors, createDoctor } from "@/app/admin/doctors/_services/doctor.service"
import { doctorSchema } from "@/app/admin/doctors/_schemas/doctor.schema"

export async function GET() {
  const doctors = await getDoctors()
  return NextResponse.json(doctors)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = doctorSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
    }
    const created = await createDoctor(parsed.data)
    return NextResponse.json(created, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create doctor" }, { status: 500 })
  }
}
