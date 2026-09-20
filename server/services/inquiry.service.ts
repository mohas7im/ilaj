import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

export interface InquiryFilters {
  pageNumber?: number
  pageSize?: number
  search?: string
  treatment?: string
  from?: string
  to?: string
}

export async function getInquiries(params?: InquiryFilters) {
  const pageNumber = Math.max(1, params?.pageNumber || 1)
  const pageSize = Math.max(1, Math.min(100, params?.pageSize || 10))
  const search = params?.search?.trim() || ""
  const treatment = params?.treatment?.trim() || ""
  const from = params?.from?.trim() || ""
  const to = params?.to?.trim() || ""

  const where: Prisma.InquiryWhereInput = {}

  if (treatment && treatment !== "all") {
    where.treatment = { equals: treatment, mode: "insensitive" }
  }

  if (search) {
    where.OR = [
      { fullName: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
      { message: { contains: search, mode: "insensitive" } },
    ]
  }

  if (from || to) {
    const createdAtFilter: Prisma.DateTimeFilter = {}
    if (from) {
      const fromDate = new Date(from)
      if (!isNaN(fromDate.getTime())) {
        fromDate.setHours(0, 0, 0, 0)
        createdAtFilter.gte = fromDate
      }
    }
    if (to) {
      const toDate = new Date(to)
      if (!isNaN(toDate.getTime())) {
        toDate.setHours(23, 59, 59, 999)
        createdAtFilter.lte = toDate
      }
    }
    if (createdAtFilter.gte || createdAtFilter.lte) {
      where.createdAt = createdAtFilter
    }
  }

  const total = await prisma.inquiry.count({ where })
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const skip = (pageNumber - 1) * pageSize

  const rawInquiries = await prisma.inquiry.findMany({
    where,
    skip,
    take: pageSize,
    orderBy: { createdAt: "desc" },
  })

  const inquiries = rawInquiries.map((inq) => ({
    id: inq.id,
    fullName: inq.fullName,
    email: inq.email,
    phone: inq.phone,
    treatment: inq.treatment,
    preferredDate: inq.preferredDate,
    preferredTime: inq.preferredTime,
    message: inq.message,
    status: inq.status,
    createdAt: inq.createdAt.toISOString(),
    updatedAt: inq.updatedAt.toISOString(),
  }))

  return {
    inquiries,
    pagination: {
      pageNumber,
      pageSize,
      total,
      totalPages,
    },
  }
}

export async function getInquiryById(id: string) {
  const inq = await prisma.inquiry.findUnique({ where: { id } })
  if (!inq) return null
  return {
    ...inq,
    createdAt: inq.createdAt.toISOString(),
    updatedAt: inq.updatedAt.toISOString(),
  }
}

export async function createInquiry(data: {
  fullName: string
  email: string
  phone?: string | null
  treatment: string
  preferredDate?: string | null
  preferredTime?: string | null
  message: string
  status?: string
}) {
  const created = await prisma.inquiry.create({
    data: {
      fullName: data.fullName.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone?.trim() || null,
      treatment: data.treatment.trim(),
      preferredDate: data.preferredDate?.trim() || null,
      preferredTime: data.preferredTime?.trim() || null,
      message: data.message.trim(),
      status: data.status || "new",
    },
  })

  return {
    ...created,
    createdAt: created.createdAt.toISOString(),
    updatedAt: created.updatedAt.toISOString(),
  }
}

export async function updateInquiryStatus(id: string, status: string) {
  const updated = await prisma.inquiry.update({
    where: { id },
    data: { status },
  })

  return {
    ...updated,
    createdAt: updated.createdAt.toISOString(),
    updatedAt: updated.updatedAt.toISOString(),
  }
}

export async function deleteInquiry(id: string): Promise<boolean> {
  try {
    await prisma.inquiry.delete({ where: { id } })
    return true
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return false
    }
    throw error
  }
}
