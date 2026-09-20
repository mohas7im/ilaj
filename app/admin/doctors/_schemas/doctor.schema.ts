import { z } from "zod"

export const doctorSchema = z.object({
  name: z.string().min(1, "Doctor name is required"),
  designation: z.string().min(1, "Designation is required"),
  specialization: z.string().min(1, "Specialization is required"),
  bio: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  imageAlt: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  displayOrder: z.coerce.number().int().min(1).default(1),
})

export type DoctorFormData = z.infer<typeof doctorSchema>
