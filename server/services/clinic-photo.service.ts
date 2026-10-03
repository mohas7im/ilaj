import { prisma } from "@/lib/prisma"
import { Prisma } from "@/lib/generated/prisma/client"
import type { ClinicPhoto } from "@/domain/clinic-photo/clinic-photo.types"
import type { ClinicPhotoInput } from "@/domain/clinic-photo/clinic-photo.schema"

export async function getClinicPhotos(): Promise<ClinicPhoto[]> {
  try {
    const photos = await prisma.clinicPhoto.findMany({
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    })

    return photos.map((p) => ({
      id: p.id,
      heading: p.heading,
      description: p.description,
      image: p.image,
      alt: p.alt,
      displayOrder: p.displayOrder,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }))
  } catch (error) {
    console.error("getClinicPhotos error:", error)
    throw error
  }
}

export async function getClinicPhotoById(id: string): Promise<ClinicPhoto | null> {
  try {
    const photo = await prisma.clinicPhoto.findUnique({
      where: { id },
    })
    if (!photo) return null
    return {
      id: photo.id,
      heading: photo.heading,
      description: photo.description,
      image: photo.image,
      alt: photo.alt,
      displayOrder: photo.displayOrder,
      createdAt: photo.createdAt.toISOString(),
      updatedAt: photo.updatedAt.toISOString(),
    }
  } catch (error) {
    console.error("getClinicPhotoById error:", error)
    throw error
  }
}

export async function createClinicPhoto(data: ClinicPhotoInput): Promise<ClinicPhoto> {
  try {
    const created = await prisma.clinicPhoto.create({
      data: {
        heading: data.heading,
        description: data.description || null,
        image: data.image,
        alt: data.alt,
        displayOrder: data.displayOrder ?? 1,
      },
    })
    return {
      id: created.id,
      heading: created.heading,
      description: created.description,
      image: created.image,
      alt: created.alt,
      displayOrder: created.displayOrder,
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
    }
  } catch (error) {
    console.error("createClinicPhoto error:", error)
    throw error
  }
}

export async function updateClinicPhoto(
  id: string,
  data: Partial<ClinicPhotoInput>
): Promise<ClinicPhoto | null> {
  try {
    const updated = await prisma.clinicPhoto.update({
      where: { id },
      data: {
        ...(data.heading !== undefined && { heading: data.heading }),
        ...(data.description !== undefined && { description: data.description || null }),
        ...(data.image !== undefined && { image: data.image }),
        ...(data.alt !== undefined && { alt: data.alt }),
        ...(data.displayOrder !== undefined && { displayOrder: data.displayOrder }),
      },
    })
    return {
      id: updated.id,
      heading: updated.heading,
      description: updated.description,
      image: updated.image,
      alt: updated.alt,
      displayOrder: updated.displayOrder,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return null
    }
    console.error("updateClinicPhoto error:", error)
    throw error
  }
}

export async function deleteClinicPhoto(id: string): Promise<boolean> {
  try {
    await prisma.clinicPhoto.delete({
      where: { id },
    })
    return true
  } catch (error) {
    console.error("deleteClinicPhoto error:", error)
    return false
  }
}
