import { z } from "zod"

export const patientCaseSchema = z.object({
  heading: z.string().min(1, "Heading is required"),
  description: z.string().min(1, "Description is required"),
  beforeImage: z.string().min(1, "Before image is required"),
  afterImage: z.string().min(1, "After image is required"),
  beforeAlt: z.string().min(1, "Before image alt text is required"),
  afterAlt: z.string().min(1, "After image alt text is required"),
})

export type PatientCaseInput = z.infer<typeof patientCaseSchema>
