import { NextResponse } from "next/server"
import {
  getDoctorById,
  updateDoctor,
  deleteDoctor,
} from "@/server/services/doctor.service"
import { doctorSchema } from "@/app/admin/doctors/_schemas/doctor.schema"

type Props = { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Props) {
  try {
    const { id } = await params
    const doctor = await getDoctorById(id)
    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 })
    }
    return NextResponse.json(doctor)
  } catch (error) {
    console.error("GET /api/doctors/[id] error:", error)
    return NextResponse.json({ error: "Failed to fetch doctor" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: Props) {
  try {
    const { id } = await params
    const body = await req.json()
    const parsed = doctorSchema.partial().safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
    }
    const updated = await updateDoctor(id, parsed.data)
    if (!updated) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 })
    }
    return NextResponse.json(updated)
  } catch (error) {
    console.error("PUT /api/doctors/[id] error:", error)
    return NextResponse.json({ error: "Failed to update doctor" }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: Props) {
  try {
    const { id } = await params
    const deleted = await deleteDoctor(id)
    if (!deleted) {
      return NextResponse.json({ error: "Doctor not found or failed to delete" }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/doctors/[id] error:", error)
    return NextResponse.json({ error: "Failed to delete doctor" }, { status: 500 })
  }
}

