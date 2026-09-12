export type ClinicSettings = {
  // Contact Information
  primaryEmail: string
  secondaryEmail: string
  phone1: string
  phone2: string
  whatsappNumber: string
  address: string

  // Clinic Statistics / Highlights
  yearsOfExperience: string
  totalPatients: string
  satisfactionRate: string

  // Working Hours & Schedule
  workingHoursWeekday: string
  workingHoursSaturday: string
  sundayOpen: boolean
  workingHoursSunday: string

  // Social & Maps
  facebook: string
  instagram: string
  linkedin: string
  twitter: string
  pinterest: string
  mapLink: string
}
