import { z } from "zod"

export const doctorSchema = z.object({
  name: z.string().min(1, "Doctor name is required"),
  designation: z.string().min(1, "Designation is required"),
  specialization: z.string().min(1, "Specialization is required"),
  bio: z.string().optional(),
  image: z.string().optional(),
  imageAlt: z.string().optional(),
  isActive: z.boolean().default(true),
})

export type DoctorFormData = z.infer<typeof doctorSchema>
