import { z } from "zod"

export const whyChooseUsItemSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  description: z.string().optional().nullable(),
  displayOrder: z.coerce.number().min(1, "Display order must be at least 1").default(1),
})

export type WhyChooseUsItemFormData = z.infer<typeof whyChooseUsItemSchema>
