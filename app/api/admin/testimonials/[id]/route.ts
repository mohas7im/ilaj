import { NextResponse } from "next/server"
import {
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
} from "@/server/services/testimonial.service"
import { testimonialSchema } from "@/app/admin/testimonials/_schemas/testimonial.schema"
import { requireAdmin } from "@/lib/auth/require-admin"

type Props = { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Props) {
  const denied = await requireAdmin()
  if (denied) return denied

  try {
    const { id } = await params
    const testimonial = await getTestimonialById(id)
    if (!testimonial) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 })
    }
    return NextResponse.json(testimonial)
  } catch (error) {
    console.error("GET /api/admin/testimonials/[id] error:", error)
    return NextResponse.json({ error: "Failed to fetch testimonial" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: Props) {
  const denied = await requireAdmin()
  if (denied) return denied

  try {
    const { id } = await params
    const body = await req.json()
    const parsed = testimonialSchema.partial().safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
    }
    const updated = await updateTestimonial(id, parsed.data)
    if (!updated) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 })
    }
    return NextResponse.json(updated)
  } catch (error) {
    console.error("PUT /api/admin/testimonials/[id] error:", error)
    return NextResponse.json({ error: "Failed to update testimonial" }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: Props) {
  const denied = await requireAdmin()
  if (denied) return denied

  try {
    const { id } = await params
    const deleted = await deleteTestimonial(id)
    if (!deleted) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/admin/testimonials/[id] error:", error)
    return NextResponse.json({ error: "Failed to delete testimonial" }, { status: 500 })
  }
}
