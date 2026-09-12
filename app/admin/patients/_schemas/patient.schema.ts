import { z } from "zod"

export const patientSchema = z.object({
  name: z.string().min(1, "Patient name is required"),
  email: z.string().email("Valid email required").optional().or(z.literal("")),
  phone: z.string().min(1, "Phone number is required"),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  address: z.string().optional(),
  medicalHistory: z.string().optional(),
})

export type PatientFormData = z.infer<typeof patientSchema>
