import { prisma } from "@/lib/prisma"

export interface DashboardStats {
  totalInquiries: number
  totalDoctors: number
  totalServices: number
  totalTestimonials: number
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [totalInquiries, totalDoctors, totalServices, totalTestimonials] = await Promise.all([
    prisma.inquiry.count(),
    prisma.doctor.count(),
    prisma.service.count(),
    prisma.testimonial.count(),
  ])

  return {
    totalInquiries,
    totalDoctors,
    totalServices,
    totalTestimonials,
  }
}
