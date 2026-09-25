import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import type { WhyChooseUsItem } from "@/domain/why-choose-us/why-choose-us.types"
import type { WhyChooseUsItemFormData } from "@/domain/why-choose-us/why-choose-us.schema"

export async function getWhyChooseUsItems(): Promise<WhyChooseUsItem[]> {
  try {
    const items = await prisma.whyChooseUsItem.findMany({
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    })

    return items.map((it) => ({
      id: it.id,
      title: it.title,
      description: it.description,
      displayOrder: it.displayOrder,
      createdAt: it.createdAt.toISOString(),
      updatedAt: it.updatedAt.toISOString(),
    }))
  } catch (error) {
    console.error("getWhyChooseUsItems error:", error)
    throw error
  }
}

export async function getWhyChooseUsItemById(
  id: string
): Promise<WhyChooseUsItem | null> {
  try {
    const item = await prisma.whyChooseUsItem.findUnique({
      where: { id },
    })
    if (!item) return null
    return {
      id: item.id,
      title: item.title,
      description: item.description,
      displayOrder: item.displayOrder,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    }
  } catch (error) {
    console.error("getWhyChooseUsItemById error:", error)
    throw error
  }
}

export async function createWhyChooseUsItem(
  data: WhyChooseUsItemFormData
): Promise<WhyChooseUsItem> {
  try {
    const created = await prisma.whyChooseUsItem.create({
      data: {
        title: data.title,
        description: data.description ?? null,
        displayOrder: data.displayOrder ?? 1,
      },
    })
    return {
      id: created.id,
      title: created.title,
      description: created.description,
      displayOrder: created.displayOrder,
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
    }
  } catch (error) {
    console.error("createWhyChooseUsItem error:", error)
    throw error
  }
}

export async function updateWhyChooseUsItem(
  id: string,
  data: Partial<WhyChooseUsItemFormData>
): Promise<WhyChooseUsItem | null> {
  try {
    const updated = await prisma.whyChooseUsItem.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.displayOrder !== undefined && { displayOrder: data.displayOrder }),
      },
    })
    return {
      id: updated.id,
      title: updated.title,
      description: updated.description,
      displayOrder: updated.displayOrder,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return null
    }
    console.error("updateWhyChooseUsItem error:", error)
    throw error
  }
}

export async function deleteWhyChooseUsItem(id: string): Promise<boolean> {
  try {
    await prisma.whyChooseUsItem.delete({
      where: { id },
    })
    return true
  } catch (error) {
    console.error("deleteWhyChooseUsItem error:", error)
    return false
  }
}
