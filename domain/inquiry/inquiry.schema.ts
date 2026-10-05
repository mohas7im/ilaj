import { z } from "zod"

export const inquirySchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  phone: z.string().min(1, "Phone number is required"),
  // Optional fields: an empty string means "not provided".
  email: z.union([z.literal(""), z.string().email("Enter a valid email address")]).optional().default(""),
  treatment: z.string().optional().default(""),
  preferredDate: z.string().optional().default(""),
  preferredTime: z.string().optional().default(""),
  message: z.string().optional().default(""),
  type: z.enum(["appointment", "inquiry"]).optional().default("appointment"),
  status: z.string().optional(),
})

export type InquiryFormData = z.infer<typeof inquirySchema>
