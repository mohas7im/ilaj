import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import type { ClinicPhoto } from "@/app/admin/gallery/clinic/_types/clinic-photo.types"
import type { ClinicPhotoInput } from "@/app/admin/gallery/clinic/_schemas/clinic-photo.schema"

export const INITIAL_CLINIC_PHOTOS = [
  {
    heading: "Treatment Suite & Dental Unit",
    description: "Modern, ergonomic dental chair with digital monitoring and panoramic window view.",
    image: "/admin/clinic-gallery-room.jpg",
    alt: "Modern ergonomic dental chair and treatment equipment in clinic suite",
    displayOrder: 1,
  },
  {
    heading: "Reception & Architectural Lounge",
    description: "Spacious, comfortable patient waiting lounge with natural slate and glass architecture.",
    image: "/admin/login-showcase.jpg",
    alt: "Spacious clinic reception and patient waiting lounge",
    displayOrder: 2,
  },
  {
    heading: "Consultation & Smile Design Studio",
    description: "Dedicated digital imaging and treatment planning consultation area.",
    image: "/admin/clinic-gallery-room.jpg",
    alt: "Digital smile design and patient consultation studio",
    displayOrder: 3,
  },
]

export async function getClinicPhotos(): Promise<ClinicPhoto[]> {
  try {
    const count = await prisma.clinicPhoto.count()
    if (count === 0) {
      await prisma.clinicPhoto.createMany({
        data: INITIAL_CLINIC_PHOTOS,
      })
    }

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
