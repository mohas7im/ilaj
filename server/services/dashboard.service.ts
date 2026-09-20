import { prisma } from "@/lib/prisma"

export interface DashboardStats {
  totalInquiries: number
  totalDoctors: number
  totalServices: number
  totalTestimonials: number
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [totalInquiries, totalDoctors, totalServices, totalTestimonials] = await Promise.all([
    prisma.inquiry.count().catch((err: unknown) => {
      console.error("prisma.inquiry.count error:", err)
      return 0
    }),
    prisma.doctor.count().catch((err: unknown) => {
      console.error("prisma.doctor.count error:", err)
      return 0
    }),
    prisma.service.count().catch((err: unknown) => {
      console.error("prisma.service.count error:", err)
      return 0
    }),
    prisma.testimonial.count().catch((err: unknown) => {
      console.error("prisma.testimonial.count error:", err)
      return 0
    }),
  ])

  return {
    totalInquiries,
    totalDoctors,
    totalServices,
    totalTestimonials,
  }
}
