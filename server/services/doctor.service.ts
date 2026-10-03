import { prisma } from "@/lib/prisma"
import { Prisma } from "@/lib/generated/prisma/client"
import type { Doctor } from "@/domain/doctor/doctor.types"
import type { DoctorFormData } from "@/domain/doctor/doctor.schema"

export async function getDoctors(options?: { activeOnly?: boolean }): Promise<Doctor[]> {
  const doctors = await prisma.doctor.findMany({
    where: options?.activeOnly ? { isActive: true } : undefined,
    orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
  })
  return doctors as Doctor[]
}

export async function getDoctorById(id: string): Promise<Doctor | null> {
  const doctor = await prisma.doctor.findUnique({
    where: { id },
  })
  return doctor as Doctor | null
}

export async function createDoctor(data: DoctorFormData): Promise<Doctor> {
  const created = await prisma.doctor.create({
    data: {
      name: data.name,
      designation: data.designation,
      specialization: data.specialization,
      bio: data.bio || null,
      image: data.image || null,
      imageAlt: data.imageAlt || null,
      isActive: data.isActive ?? true,
      displayOrder: data.displayOrder ?? 1,
    },
  })
  return created as Doctor
}

export async function updateDoctor(
  id: string,
  data: Partial<DoctorFormData>
): Promise<Doctor | null> {
  try {
    const updated = await prisma.doctor.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.designation !== undefined && { designation: data.designation }),
        ...(data.specialization !== undefined && { specialization: data.specialization }),
        ...(data.bio !== undefined && { bio: data.bio || null }),
        ...(data.image !== undefined && { image: data.image || null }),
        ...(data.imageAlt !== undefined && { imageAlt: data.imageAlt || null }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(data.displayOrder !== undefined && { displayOrder: data.displayOrder }),
      },
    })
    return updated as Doctor
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return null
    }
    console.error("updateDoctor error:", error)
    throw error
  }
}

export async function deleteDoctor(id: string): Promise<boolean> {
  try {
    await prisma.doctor.delete({
      where: { id },
    })
    return true
  } catch (error) {
    console.error("deleteDoctor error:", error)
    return false
  }
}
