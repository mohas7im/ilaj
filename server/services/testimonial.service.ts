import { prisma } from "@/lib/prisma"
import { Prisma } from "@/lib/generated/prisma/client"
import type { Testimonial, TestimonialStatus } from "@/domain/testimonial/testimonial.types"
import type { TestimonialFormData } from "@/domain/testimonial/testimonial.schema"

export async function getTestimonials(options?: { publishedOnly?: boolean }): Promise<Testimonial[]> {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: options?.publishedOnly ? { status: "published" } : undefined,
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    })

    return testimonials.map((t) => ({
      id: t.id,
      patientName: t.patientName,
      treatment: t.treatment,
      rating: t.rating,
      review: t.review,
      status: t.status as TestimonialStatus,
      displayOrder: t.displayOrder,
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
    }))
  } catch (error) {
    console.error("getTestimonials error:", error)
    throw error
  }
}

export async function getTestimonialById(id: string): Promise<Testimonial | null> {
  try {
    const testimonial = await prisma.testimonial.findUnique({
      where: { id },
    })
    if (!testimonial) return null
    return {
      id: testimonial.id,
      patientName: testimonial.patientName,
      treatment: testimonial.treatment,
      rating: testimonial.rating,
      review: testimonial.review,
      status: testimonial.status as TestimonialStatus,
      displayOrder: testimonial.displayOrder,
      createdAt: testimonial.createdAt.toISOString(),
      updatedAt: testimonial.updatedAt.toISOString(),
    }
  } catch (error) {
    console.error("getTestimonialById error:", error)
    throw error
  }
}

export async function createTestimonial(data: TestimonialFormData): Promise<Testimonial> {
  try {
    const created = await prisma.testimonial.create({
      data: {
        patientName: data.patientName,
        treatment: data.treatment,
        rating: data.rating,
        review: data.review,
        status: data.status,
        displayOrder: data.displayOrder ?? 1,
      },
    })
    return {
      id: created.id,
      patientName: created.patientName,
      treatment: created.treatment,
      rating: created.rating,
      review: created.review,
      status: created.status as TestimonialStatus,
      displayOrder: created.displayOrder,
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
    }
  } catch (error) {
    console.error("createTestimonial error:", error)
    throw error
  }
}

export async function updateTestimonial(
  id: string,
  data: Partial<TestimonialFormData>
): Promise<Testimonial | null> {
  try {
    const updated = await prisma.testimonial.update({
      where: { id },
      data: {
        ...(data.patientName !== undefined && { patientName: data.patientName }),
        ...(data.treatment !== undefined && { treatment: data.treatment }),
        ...(data.rating !== undefined && { rating: data.rating }),
        ...(data.review !== undefined && { review: data.review }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.displayOrder !== undefined && { displayOrder: data.displayOrder }),
      },
    })
    return {
      id: updated.id,
      patientName: updated.patientName,
      treatment: updated.treatment,
      rating: updated.rating,
      review: updated.review,
      status: updated.status as TestimonialStatus,
      displayOrder: updated.displayOrder,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return null
    }
    console.error("updateTestimonial error:", error)
    throw error
  }
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  try {
    await prisma.testimonial.delete({
      where: { id },
    })
    return true
  } catch (error) {
    console.error("deleteTestimonial error:", error)
    return false
  }
}
