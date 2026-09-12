import { z } from "zod"

export const serviceSchema = z.object({
  name: z.string().min(1, "Service name is required"),
  slug: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
  image: z.string().optional(),
  secondaryImage: z.string().optional(),
})

export type ServiceFormData = z.infer<typeof serviceSchema>
