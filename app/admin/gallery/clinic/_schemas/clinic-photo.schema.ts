import { z } from "zod"

export const clinicPhotoSchema = z.object({
  heading: z.string().min(1, "Heading is required"),
  description: z.string().optional().nullable(),
  image: z.string().min(1, "Image is required"),
  alt: z.string().min(1, "Image alt text is required"),
  displayOrder: z.coerce.number().optional().default(1),
})

export type ClinicPhotoInput = z.infer<typeof clinicPhotoSchema>
