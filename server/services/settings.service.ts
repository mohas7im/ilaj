import { prisma } from "@/lib/prisma"
import type { ClinicSettings } from "@/app/admin/settings/_types/settings.types"

export const DEFAULT_SETTINGS_RECORD: Omit<ClinicSettings, "id" | "createdAt" | "updatedAt"> = {
  clinicName: "",
  tagline: "",
  primaryEmail: "",
  secondaryEmail: "",
  phone1: "",
  phone2: "",
  whatsappNumber: "",
  address: "",
  yearsOfExperience: "",
  totalPatients: "",
  satisfactionRate: "",
  workingHoursWeekday: "",
  workingHoursSaturday: "",
  sundayOpen: false,
  workingHoursSunday: "",
  facebook: "",
  instagram: "",
  linkedin: "",
  twitter: "",
  pinterest: "",
  mapLink: "",
}

const SINGLETON_ID = "clinic_settings_singleton"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapToClinicSettings(item: any): ClinicSettings {
  return {
    id: item.id,
    clinicName: item.clinicName ?? "",
    tagline: item.tagline ?? "",
    primaryEmail: item.primaryEmail ?? "",
    secondaryEmail: item.secondaryEmail ?? "",
    phone1: item.phone1 ?? "",
    phone2: item.phone2 ?? "",
    whatsappNumber: item.whatsappNumber ?? "",
    address: item.address ?? "",
    yearsOfExperience: item.yearsOfExperience ?? "",
    totalPatients: item.totalPatients ?? "",
    satisfactionRate: item.satisfactionRate ?? "",
    workingHoursWeekday: item.workingHoursWeekday ?? "",
    workingHoursSaturday: item.workingHoursSaturday ?? "",
    sundayOpen: Boolean(item.sundayOpen),
    workingHoursSunday: item.workingHoursSunday ?? "",
    facebook: item.facebook ?? "",
    instagram: item.instagram ?? "",
    linkedin: item.linkedin ?? "",
    twitter: item.twitter ?? "",
    pinterest: item.pinterest ?? "",
    mapLink: item.mapLink ?? "",
    createdAt: item.createdAt ? new Date(item.createdAt).toISOString() : undefined,
    updatedAt: item.updatedAt ? new Date(item.updatedAt).toISOString() : undefined,
  }
}

export async function getClinicSettings(): Promise<ClinicSettings> {
  try {
    let settings = await prisma.clinicSettings.findFirst()
    if (!settings) {
      settings = await prisma.clinicSettings.create({
        data: {
          id: SINGLETON_ID,
          ...DEFAULT_SETTINGS_RECORD,
        },
      })
    }
    return mapToClinicSettings(settings)
  } catch (error) {
    console.error("getClinicSettings error:", error)
    throw error
  }
}

export async function updateClinicSettings(
  data: Partial<ClinicSettings>
): Promise<ClinicSettings> {
  try {
    const existing = await prisma.clinicSettings.findFirst()
    const targetId = existing?.id || SINGLETON_ID

    const updateData = {
      ...(data.clinicName !== undefined && { clinicName: data.clinicName }),
      ...(data.tagline !== undefined && { tagline: data.tagline }),
      ...(data.primaryEmail !== undefined && { primaryEmail: data.primaryEmail }),
      ...(data.secondaryEmail !== undefined && { secondaryEmail: data.secondaryEmail }),
      ...(data.phone1 !== undefined && { phone1: data.phone1 }),
      ...(data.phone2 !== undefined && { phone2: data.phone2 }),
      ...(data.whatsappNumber !== undefined && { whatsappNumber: data.whatsappNumber }),
      ...(data.address !== undefined && { address: data.address }),
      ...(data.yearsOfExperience !== undefined && { yearsOfExperience: data.yearsOfExperience }),
      ...(data.totalPatients !== undefined && { totalPatients: data.totalPatients }),
      ...(data.satisfactionRate !== undefined && { satisfactionRate: data.satisfactionRate }),
      ...(data.workingHoursWeekday !== undefined && { workingHoursWeekday: data.workingHoursWeekday }),
      ...(data.workingHoursSaturday !== undefined && { workingHoursSaturday: data.workingHoursSaturday }),
      ...(data.sundayOpen !== undefined && { sundayOpen: data.sundayOpen }),
      ...(data.workingHoursSunday !== undefined && { workingHoursSunday: data.workingHoursSunday }),
      ...(data.facebook !== undefined && { facebook: data.facebook }),
      ...(data.instagram !== undefined && { instagram: data.instagram }),
      ...(data.linkedin !== undefined && { linkedin: data.linkedin }),
      ...(data.twitter !== undefined && { twitter: data.twitter }),
      ...(data.pinterest !== undefined && { pinterest: data.pinterest }),
      ...(data.mapLink !== undefined && { mapLink: data.mapLink }),
    }

    const updated = await prisma.clinicSettings.upsert({
      where: { id: targetId },
      create: {
        id: targetId,
        ...DEFAULT_SETTINGS_RECORD,
        ...updateData,
      },
      update: updateData,
    })

    return mapToClinicSettings(updated)
  } catch (error) {
    console.error("updateClinicSettings error:", error)
    throw error
  }
}
