import { prisma } from "@/lib/prisma"
import type { Service, ServiceFaq } from "@/domain/service/service.types"
import type { ServiceFormData } from "@/domain/service/service.schema"
import { sanitizeRichText } from "@/server/lib/sanitize"

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/&/g, "-and-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "")
}

export async function getUniqueSlug(baseText: string, currentId?: string): Promise<string> {
  const baseSlug = slugify(baseText) || "service"
  let slug = baseSlug
  let counter = 1

  while (true) {
    const existing = await prisma.service.findUnique({
      where: { slug },
      select: { id: true },
    })
    if (!existing || (currentId && existing.id === currentId)) {
      return slug
    }
    slug = `${baseSlug}-${counter}`
    counter++
  }
}

export async function getServices(): Promise<Service[]> {
  const services = await prisma.service.findMany({
    orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
  })

  return services as Service[]
}

const faqsInOrder = {
  select: { id: true, question: true, answer: true, displayOrder: true },
  orderBy: { displayOrder: "asc" },
} as const

/** Includes the service's FAQs, in display order. */
export async function getServiceById(id: string): Promise<Service | null> {
  const service = await prisma.service.findUnique({
    where: { id },
    include: { faqs: faqsInOrder },
  })
  return service as Service | null
}

/** A treatment's FAQs, in display order (for the website). */
export async function getServiceFaqs(serviceId: string): Promise<ServiceFaq[]> {
  return prisma.serviceFaq.findMany({ where: { serviceId }, ...faqsInOrder })
}

// Form rows → rows to create; list position becomes displayOrder.
function toFaqRows(faqs: NonNullable<ServiceFormData["faqs"]>) {
  return faqs.map((faq, index) => ({
    question: faq.question,
    answer: faq.answer,
    displayOrder: index + 1,
  }))
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const service = await prisma.service.findUnique({
    where: { slug },
  })
  return service as Service | null
}

export async function createService(data: ServiceFormData): Promise<Service> {
  const slug = await getUniqueSlug(data.slug?.trim() || data.name)

  const created = await prisma.service.create({
    data: {
      name: data.name,
      slug,
      description: data.description || null,
      details: sanitizeRichText(data.details),
      status: data.status,
      displayOrder: data.displayOrder ?? 1,
      showInHomePage: data.showInHomePage ?? false,
      image: data.image || null,
      imageAlt: data.imageAlt || null,
      secondaryImage: data.secondaryImage || null,
      secondaryImageAlt: data.secondaryImageAlt || null,
      ...(data.faqs?.length && { faqs: { create: toFaqRows(data.faqs) } }),
    },
    include: { faqs: faqsInOrder },
  })

  return created as Service
}

export async function updateService(
  id: string,
  data: Partial<ServiceFormData>
): Promise<Service | null> {
  const existing = await prisma.service.findUnique({ where: { id } })
  if (!existing) return null

  let slug = existing.slug
  if (data.slug && data.slug.trim() !== existing.slug) {
    slug = await getUniqueSlug(data.slug.trim(), id)
  } else if (!data.slug && data.name && data.name !== existing.name) {
    slug = await getUniqueSlug(data.name, id)
  }

  const updated = await prisma.service.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      slug,
      ...(data.description !== undefined && { description: data.description || null }),
      ...(data.details !== undefined && { details: sanitizeRichText(data.details) }),
      ...(data.status !== undefined && { status: data.status }),
      ...(data.displayOrder !== undefined && { displayOrder: data.displayOrder }),
      ...(data.showInHomePage !== undefined && { showInHomePage: data.showInHomePage }),
      ...(data.image !== undefined && { image: data.image || null }),
      ...(data.imageAlt !== undefined && { imageAlt: data.imageAlt || null }),
      ...(data.secondaryImage !== undefined && { secondaryImage: data.secondaryImage || null }),
      ...(data.secondaryImageAlt !== undefined && { secondaryImageAlt: data.secondaryImageAlt || null }),
      // Replace the whole list; runs in the same transaction as the update
      ...(data.faqs !== undefined && {
        faqs: { deleteMany: {}, create: toFaqRows(data.faqs) },
      }),
    },
    include: { faqs: faqsInOrder },
  })

  return updated as Service
}

export async function deleteService(id: string): Promise<boolean> {
  try {
    await prisma.service.delete({
      where: { id },
    })
    return true
  } catch {
    return false
  }
}
