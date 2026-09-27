import { z } from "zod"

export const faqSchema = z.object({
  question: z.string().trim().min(1, "Question is required"),
  answer: z.string().trim().min(1, "Answer is required"),
  status: z.enum(["published", "draft"]).default("published"),
  displayOrder: z.coerce.number().min(1, "Display order must be at least 1").default(1),
})

export type FaqFormData = z.infer<typeof faqSchema>
