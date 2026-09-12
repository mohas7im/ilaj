import type { ClinicSettings } from "../_types/settings.types"

export let CLINIC_SETTINGS: ClinicSettings = {
  primaryEmail: "info@ilajdental.com",
  secondaryEmail: "appointments@ilajdental.com",
  phone1: "+92 300 1234567",
  phone2: "+92 321 7654321",
  whatsappNumber: "+92 300 1234567",
  address: "Suite 402, Medical Arts Building, Main Boulevard, Gulberg III, Lahore, Pakistan",

  yearsOfExperience: "15+",
  totalPatients: "12,500+",
  satisfactionRate: "99.4%",

  workingHoursWeekday: "09:00 AM - 08:00 PM",
  workingHoursSaturday: "10:00 AM - 06:00 PM",
  sundayOpen: false,
  workingHoursSunday: "11:00 AM - 04:00 PM",

  facebook: "ilajdentalclinic",
  instagram: "ilajdental",
  linkedin: "ilaj-dental-practice",
  twitter: "ilajdental",
  pinterest: "ilajdentalcare",
  mapLink: "place/Ilaj+Dental+Clinic/@31.5204,74.3587,17z",
}

export async function getSettings(): Promise<ClinicSettings> {
  return { ...CLINIC_SETTINGS }
}

export async function updateSettings(data: Partial<ClinicSettings>): Promise<ClinicSettings> {
  CLINIC_SETTINGS = { ...CLINIC_SETTINGS, ...data }
  return { ...CLINIC_SETTINGS }
}
