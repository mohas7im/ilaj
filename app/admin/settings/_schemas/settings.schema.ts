import { z } from "zod"

export const settingsSchema = z.object({
  primaryEmail: z.string().email("Valid primary email is required"),
  secondaryEmail: z.string().email("Valid secondary email is required").or(z.literal("")),
  phone1: z.string().min(1, "Phone number 1 is required"),
  phone2: z.string().optional().default(""),
  whatsappNumber: z.string().optional().default(""),
  address: z.string().min(1, "Address is required"),

  yearsOfExperience: z.string().min(1, "Years of experience is required"),
  totalPatients: z.string().min(1, "Total patients count is required"),
  satisfactionRate: z.string().min(1, "Satisfaction rate is required"),

  workingHoursWeekday: z.string().min(1, "Weekday working hours are required"),
  workingHoursSaturday: z.string().min(1, "Saturday working hours are required"),
  sundayOpen: z.boolean().default(false),
  workingHoursSunday: z.string().optional().default(""),

  facebook: z.string().optional().default(""),
  instagram: z.string().optional().default(""),
  linkedin: z.string().optional().default(""),
  twitter: z.string().optional().default(""),
  pinterest: z.string().optional().default(""),
  mapLink: z.string().optional().default(""),
})

export type SettingsFormData = z.infer<typeof settingsSchema>
