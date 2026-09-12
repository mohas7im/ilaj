import { z } from "zod"

export const serviceSchema = z.object({
  name: z.string().min(1, "Service name is required"),
  slug: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
  displayOrder: z.coerce.number().min(1, "Display order must be at least 1").default(1),
  showInHomePage: z.boolean().default(false),
  image: z.string().optional(),
  imageAlt: z.string().optional(),
  secondaryImage: z.string().optional(),
  secondaryImageAlt: z.string().optional(),
})

export type ServiceFormData = z.infer<typeof serviceSchema>
