import { NextResponse } from "next/server"
import { getTestimonials, createTestimonial } from "@/app/admin/testimonials/_services/testimonial.service"
import { testimonialSchema } from "@/app/admin/testimonials/_schemas/testimonial.schema"

export async function GET() {
  const testimonials = await getTestimonials()
  return NextResponse.json(testimonials)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = testimonialSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
    }
    const created = await createTestimonial(parsed.data)
    return NextResponse.json(created, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create testimonial" }, { status: 500 })
  }
}
