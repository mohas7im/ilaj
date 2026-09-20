import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import type { PatientCase } from "@/app/admin/gallery/patient/_types/patient-case.types"
import type { PatientCaseInput } from "@/app/admin/gallery/patient/_schemas/patient-case.schema"

export async function getPatientCases(): Promise<PatientCase[]> {
  try {
    const cases = await prisma.patientCase.findMany({
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    })

    return cases.map((c) => ({
      id: c.id,
      heading: c.heading,
      description: c.description,
      beforeImage: c.beforeImage,
      afterImage: c.afterImage,
      beforeAlt: c.beforeAlt,
      afterAlt: c.afterAlt,
      displayOrder: c.displayOrder,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
    }))
  } catch (error) {
    console.error("getPatientCases error:", error)
    throw error
  }
}

export async function getPatientCaseById(id: string): Promise<PatientCase | null> {
  try {
    const patientCase = await prisma.patientCase.findUnique({
      where: { id },
    })
    if (!patientCase) return null
    return {
      id: patientCase.id,
      heading: patientCase.heading,
      description: patientCase.description,
      beforeImage: patientCase.beforeImage,
      afterImage: patientCase.afterImage,
      beforeAlt: patientCase.beforeAlt,
      afterAlt: patientCase.afterAlt,
      displayOrder: patientCase.displayOrder,
      createdAt: patientCase.createdAt.toISOString(),
      updatedAt: patientCase.updatedAt.toISOString(),
    }
  } catch (error) {
    console.error("getPatientCaseById error:", error)
    throw error
  }
}

export async function createPatientCase(data: PatientCaseInput): Promise<PatientCase> {
  try {
    const created = await prisma.patientCase.create({
      data: {
        heading: data.heading,
        description: data.description || null,
        beforeImage: data.beforeImage,
        afterImage: data.afterImage,
        beforeAlt: data.beforeAlt,
        afterAlt: data.afterAlt,
        displayOrder: data.displayOrder ?? 1,
      },
    })
    return {
      id: created.id,
      heading: created.heading,
      description: created.description,
      beforeImage: created.beforeImage,
      afterImage: created.afterImage,
      beforeAlt: created.beforeAlt,
      afterAlt: created.afterAlt,
      displayOrder: created.displayOrder,
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
    }
  } catch (error) {
    console.error("createPatientCase error:", error)
    throw error
  }
}

export async function updatePatientCase(
  id: string,
  data: Partial<PatientCaseInput>
): Promise<PatientCase | null> {
  try {
    const updated = await prisma.patientCase.update({
      where: { id },
      data: {
        ...(data.heading !== undefined && { heading: data.heading }),
        ...(data.description !== undefined && { description: data.description || null }),
        ...(data.beforeImage !== undefined && { beforeImage: data.beforeImage }),
        ...(data.afterImage !== undefined && { afterImage: data.afterImage }),
        ...(data.beforeAlt !== undefined && { beforeAlt: data.beforeAlt }),
        ...(data.afterAlt !== undefined && { afterAlt: data.afterAlt }),
        ...(data.displayOrder !== undefined && { displayOrder: data.displayOrder }),
      },
    })
    return {
      id: updated.id,
      heading: updated.heading,
      description: updated.description,
      beforeImage: updated.beforeImage,
      afterImage: updated.afterImage,
      beforeAlt: updated.beforeAlt,
      afterAlt: updated.afterAlt,
      displayOrder: updated.displayOrder,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return null
    }
    console.error("updatePatientCase error:", error)
    throw error
  }
}

export async function deletePatientCase(id: string): Promise<boolean> {
  try {
    await prisma.patientCase.delete({
      where: { id },
    })
    return true
  } catch (error) {
    console.error("deletePatientCase error:", error)
    return false
  }
}
