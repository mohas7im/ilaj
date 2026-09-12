import { z } from "zod"

export const testimonialSchema = z.object({
  patientName: z.string().min(1, "Patient name is required"),
  treatment: z.string().min(1, "Treatment name is required"),
  rating: z.coerce.number().min(1).max(5),
  review: z.string().min(1, "Review quote is required"),
  status: z.enum(["published", "draft"]).default("published"),
})

export type TestimonialFormData = z.infer<typeof testimonialSchema>
