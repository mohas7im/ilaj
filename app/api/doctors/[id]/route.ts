import { NextResponse } from "next/server"
import {
  getDoctorById,
  updateDoctor,
  deleteDoctor,
} from "@/app/admin/doctors/_services/doctor.service"
import { doctorSchema } from "@/app/admin/doctors/_schemas/doctor.schema"

type Props = { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Props) {
  const { id } = await params
  const doctor = await getDoctorById(id)
  if (!doctor) {
    return NextResponse.json({ error: "Doctor not found" }, { status: 404 })
  }
  return NextResponse.json(doctor)
}

export async function PUT(req: Request, { params }: Props) {
  try {
    const { id } = await params
    const body = await req.json()
    const parsed = doctorSchema.partial().safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
    }
    const updated = await updateDoctor(id, parsed.data)
    if (!updated) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 })
    }
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: "Failed to update doctor" }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: Props) {
  const { id } = await params
  const deleted = await deleteDoctor(id)
  if (!deleted) {
    return NextResponse.json({ error: "Doctor not found" }, { status: 404 })
  }
  return NextResponse.json({ success: true })
}
