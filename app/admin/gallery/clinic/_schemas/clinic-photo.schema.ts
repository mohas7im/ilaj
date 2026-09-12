import { z } from "zod"

export const clinicPhotoSchema = z.object({
  heading: z.string().min(1, "Heading is required"),
  description: z.string().min(1, "Description is required"),
  image: z.string().min(1, "Image is required"),
  alt: z.string().min(1, "Image alt text is required"),
})

export type ClinicPhotoInput = z.infer<typeof clinicPhotoSchema>
