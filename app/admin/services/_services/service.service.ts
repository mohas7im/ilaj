import { prisma } from "@/lib/prisma"
import {
  SERVICE_STATUS_CONFIG,
  type Service,
} from "../_types/service.types"
import type { ServiceFormData } from "../_schemas/service.schema"

export { SERVICE_STATUS_CONFIG }


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

export async function getServiceById(id: string): Promise<Service | null> {
  const service = await prisma.service.findUnique({
    where: { id },
  })
  return service as Service | null
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
      status: data.status,
      displayOrder: data.displayOrder ?? 1,
      showInHomePage: data.showInHomePage ?? false,
      image: data.image || null,
      imageAlt: data.imageAlt || null,
      secondaryImage: data.secondaryImage || null,
      secondaryImageAlt: data.secondaryImageAlt || null,
    },
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
      ...(data.status !== undefined && { status: data.status }),
      ...(data.displayOrder !== undefined && { displayOrder: data.displayOrder }),
      ...(data.showInHomePage !== undefined && { showInHomePage: data.showInHomePage }),
      ...(data.image !== undefined && { image: data.image || null }),
      ...(data.imageAlt !== undefined && { imageAlt: data.imageAlt || null }),
      ...(data.secondaryImage !== undefined && { secondaryImage: data.secondaryImage || null }),
      ...(data.secondaryImageAlt !== undefined && { secondaryImageAlt: data.secondaryImageAlt || null }),
    },
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
