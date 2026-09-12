import { NextResponse } from "next/server"
import {
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
} from "@/app/admin/testimonials/_services/testimonial.service"
import { testimonialSchema } from "@/app/admin/testimonials/_schemas/testimonial.schema"

type Props = { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Props) {
  const { id } = await params
  const testimonial = await getTestimonialById(id)
  if (!testimonial) {
    return NextResponse.json({ error: "Testimonial not found" }, { status: 404 })
  }
  return NextResponse.json(testimonial)
}

export async function PUT(req: Request, { params }: Props) {
  try {
    const { id } = await params
    const body = await req.json()
    const parsed = testimonialSchema.partial().safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
    }
    const updated = await updateTestimonial(id, parsed.data)
    if (!updated) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 })
    }
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: "Failed to update testimonial" }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: Props) {
  const { id } = await params
  const deleted = await deleteTestimonial(id)
  if (!deleted) {
    return NextResponse.json({ error: "Testimonial not found" }, { status: 404 })
  }
  return NextResponse.json({ success: true })
}
