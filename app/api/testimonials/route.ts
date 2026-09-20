import { NextResponse } from "next/server"
import { getTestimonials, createTestimonial } from "@/server/services/testimonial.service"
import { testimonialSchema } from "@/app/admin/testimonials/_schemas/testimonial.schema"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const publishedOnly = searchParams.get("published") === "true"
    const testimonials = await getTestimonials({ publishedOnly })
    return NextResponse.json(testimonials)
  } catch (error) {
    console.error("GET /api/testimonials error:", error)
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = testimonialSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
    }
    const created = await createTestimonial(parsed.data)
    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    console.error("POST /api/testimonials error:", error)
    return NextResponse.json({ error: "Failed to create testimonial" }, { status: 500 })
  }
}
