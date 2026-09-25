import { z } from "zod"

export const testimonialSchema = z.object({
  patientName: z.string().min(1, "Patient name is required"),
  treatment: z.string().min(1, "Treatment name is required"),
  rating: z.coerce.number().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
  review: z.string().min(1, "Review quote is required"),
  status: z.enum(["published", "draft"]).default("published"),
  displayOrder: z.coerce.number().optional().default(1),
})

export type TestimonialFormData = z.infer<typeof testimonialSchema>
