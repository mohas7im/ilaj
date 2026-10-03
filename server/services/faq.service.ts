import { prisma } from "@/lib/prisma"
import { Prisma } from "@/lib/generated/prisma/client"
import type { Faq, FaqStatus } from "@/domain/faq/faq.types"
import type { FaqFormData } from "@/domain/faq/faq.schema"

// General (home page) FAQs. Treatment FAQs live in service_faqs and are
// handled by service.service.ts.

type FaqRow = Prisma.FaqGetPayload<object>

function toFaq(row: FaqRow): Faq {
  return {
    id: row.id,
    question: row.question,
    answer: row.answer,
    status: row.status as FaqStatus,
    displayOrder: row.displayOrder,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}

export async function getFaqs(options?: { publishedOnly?: boolean }): Promise<Faq[]> {
  const rows = await prisma.faq.findMany({
    where: options?.publishedOnly ? { status: "published" } : undefined,
    orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
  })
  return rows.map(toFaq)
}

export async function getFaqById(id: string): Promise<Faq | null> {
  const row = await prisma.faq.findUnique({ where: { id } })
  return row ? toFaq(row) : null
}

export async function createFaq(data: FaqFormData): Promise<Faq> {
  const created = await prisma.faq.create({
    data: {
      question: data.question,
      answer: data.answer,
      status: data.status,
      displayOrder: data.displayOrder,
    },
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
        status: data.status,
        displayOrder: data.displayOrder,
      },
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
