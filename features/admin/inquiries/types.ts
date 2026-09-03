// ─── Inquiry Types ────────────────────────────────────────────────────────────

export type InquiryStatus = "new" | "contacted" | "resolved" | "closed"

export type Inquiry = {
  id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  status: InquiryStatus
  createdAt: string
}
