import { prisma } from "@/lib/prisma"

export interface DashboardStats {
  totalInquiries: number
  totalDoctors: number
  totalServices: number
  totalTestimonials: number
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const p = prisma as any
  const inqModel = p.inquiry || p.Inquiry
  const docModel = p.doctor || p.Doctor
  const svcModel = p.service || p.Service
  const testModel = p.testimonial || p.Testimonial

  const [totalInquiries, totalDoctors, totalServices, totalTestimonials] = await Promise.all([
    inqModel?.count ? inqModel.count().catch(() => 0) : Promise.resolve(0),
    docModel?.count ? docModel.count().catch(() => 0) : Promise.resolve(0),
    svcModel?.count ? svcModel.count().catch(() => 0) : Promise.resolve(0),
    testModel?.count ? testModel.count().catch(() => 0) : Promise.resolve(0),
  ])

  return {
    totalInquiries,
    totalDoctors,
    totalServices,
    totalTestimonials,
  }
}
