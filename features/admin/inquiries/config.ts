import type { Inquiry, InquiryStatus } from "./types"

// ─── Status config ─────────────────────────────────────────────────────────────

export const INQUIRY_STATUS_CONFIG: Record<
  InquiryStatus,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
  new:       { label: "New",       variant: "default" },
  contacted: { label: "Contacted", variant: "secondary" },
  resolved:  { label: "Resolved",  variant: "outline" },
  closed:    { label: "Closed",    variant: "secondary" },
}

export const INQUIRY_STATUSES = Object.keys(
  INQUIRY_STATUS_CONFIG
) as InquiryStatus[]

// ─── Mock Data ────────────────────────────────────────────────────────────────
// Replace with API call: GET /api/admin/inquiries

export const MOCK_INQUIRIES: Inquiry[] = [
  {
    id: "i1",
    name: "Zara Khan",
    email: "zara.khan@email.com",
    phone: "+92-300-1111111",
    subject: "Dental Implant Pricing",
    message: "Hello, I would like to know the cost of dental implants and whether you offer payment plans. I need to replace two missing teeth.",
    status: "new",
    createdAt: "2024-09-03T08:00:00Z",
  },
  {
    id: "i2",
    name: "Ahmed Siddiqui",
    email: "ahmed.s@email.com",
    phone: "+92-321-2222222",
    subject: "Appointment Availability",
    message: "I am looking for an appointment this week for a general checkup. What slots are available on Thursday or Friday?",
    status: "contacted",
    createdAt: "2024-09-02T14:30:00Z",
  },
  {
    id: "i3",
    name: "Fatima Iqbal",
    email: "fatima.iqbal@email.com",
    subject: "Braces for My Child",
    message: "My 12-year-old daughter needs braces. Could you please tell me about the process and approximate cost?",
    status: "new",
    createdAt: "2024-09-02T10:15:00Z",
  },
  {
    id: "i4",
    name: "Usman Ali",
    email: "usman.ali@email.com",
    phone: "+92-333-3333333",
    subject: "Teeth Whitening",
    message: "I am interested in professional teeth whitening. How many sessions are typically needed and what is the duration of results?",
    status: "resolved",
    createdAt: "2024-09-01T16:00:00Z",
  },
  {
    id: "i5",
    name: "Nadia Rehman",
    email: "nadia.r@email.com",
    phone: "+92-345-4444444",
    subject: "Root Canal Query",
    message: "I have been experiencing tooth pain for the past week. My local dentist suggested a root canal. Do you offer this service and what is the cost?",
    status: "closed",
    createdAt: "2024-08-28T09:00:00Z",
  },
]
