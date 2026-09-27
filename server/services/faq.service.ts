import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import type { Faq, FaqStatus } from "@/domain/faq/faq.types"
import type { FaqFormData } from "@/domain/faq/faq.schema"

const withService = { service: { select: { name: true } } } as const

type FaqRow = Prisma.FaqGetPayload<{ include: typeof withService }>

function toFaq(row: FaqRow): Faq {
  return {
    id: row.id,
    question: row.question,
    answer: row.answer,
    serviceId: row.serviceId,
    serviceName: row.service?.name ?? null,
    status: row.status as FaqStatus,
    displayOrder: row.displayOrder,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}

/**
 * serviceId: undefined = all FAQs, null = General FAQs only,
 * string = that treatment's FAQs only.
 */
export async function getFaqs(options?: {
  publishedOnly?: boolean
  serviceId?: string | null
}): Promise<Faq[]> {
  const rows = await prisma.faq.findMany({
    where: {
      ...(options?.publishedOnly && { status: "published" }),
      ...(options?.serviceId !== undefined && { serviceId: options.serviceId }),
    },
    include: withService,
    orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
  })
  return rows.map(toFaq)
}

export async function getFaqById(id: string): Promise<Faq | null> {
  const row = await prisma.faq.findUnique({ where: { id }, include: withService })
  return row ? toFaq(row) : null
}

/** True when serviceId is null (General) or points to an existing service. */
export async function isValidFaqService(serviceId: string | null): Promise<boolean> {
  if (!serviceId) return true
  const service = await prisma.service.findUnique({ where: { id: serviceId }, select: { id: true } })
  return service !== null
}

export async function createFaq(data: FaqFormData): Promise<Faq> {
  const created = await prisma.faq.create({
    data: {
      question: data.question,
      answer: data.answer,
      serviceId: data.serviceId,
      status: data.status,
      displayOrder: data.displayOrder,
    },
    include: withService,
  })
  return toFaq(created)
}

export async function updateFaq(id: string, data: FaqFormData): Promise<Faq | null> {
  try {
    const updated = await prisma.faq.update({
      where: { id },
      data: {
        question: data.question,
        answer: data.answer,
        serviceId: data.serviceId,
        status: data.status,
        displayOrder: data.displayOrder,
      },
      include: withService,
    })
    return toFaq(updated)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return null
    }
    throw error
  }
}

export async function deleteFaq(id: string): Promise<boolean> {
  try {
    await prisma.faq.delete({ where: { id } })
    return true
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return false
    }
    throw error
  }
}
