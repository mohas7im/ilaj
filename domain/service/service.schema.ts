import { z } from "zod"

export const serviceFaqSchema = z.object({
  question: z.string().trim().min(1, "Every FAQ needs a question"),
  answer: z.string().trim().min(1, "Every FAQ needs an answer"),
})

export const serviceSchema = z.object({
  name: z.string().trim().min(1, "Service name is required"),
  slug: z.string().trim().optional().nullable(),
  description: z.string().optional().nullable(),
  details: z.string().optional().nullable(),
  status: z.enum(["active", "inactive"]).default("active"),
  displayOrder: z.coerce.number().min(1, "Display order must be at least 1").default(1),
  showInHomePage: z.boolean().default(false),
  image: z.string().optional().nullable(),
  imageAlt: z.string().optional().nullable(),
  secondaryImage: z.string().optional().nullable(),
  secondaryImageAlt: z.string().optional().nullable(),
  // Optional SEO overrides; empty falls back to name / description
  metaTitle: z.string().trim().optional().nullable(),
  metaDescription: z.string().trim().optional().nullable(),
  // The full list in display order; replaces the saved FAQs. Omit to keep them.
  faqs: z.array(serviceFaqSchema).max(50, "Too many FAQs").optional(),
})

export type ServiceFormData = z.infer<typeof serviceSchema>

