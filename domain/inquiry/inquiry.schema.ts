import { z } from "zod"

export const inquirySchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Valid email address is required"),
  treatment: z.string().min(1, "Please select a treatment"),
  preferredDate: z.string().min(1, "Preferred date is required"),
  preferredTime: z.string().min(1, "Preferred time is required"),
  message: z.string().min(1, "Message is required"),
  status: z.string().optional(),
})

export type InquiryFormData = z.infer<typeof inquirySchema>
