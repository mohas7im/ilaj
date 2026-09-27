export type FaqStatus = "published" | "draft"

/** General FAQ, shown on the home page. Treatment FAQs are ServiceFaq. */
export interface Faq {
  id: string
  question: string
  answer: string
  status: FaqStatus
  displayOrder: number
  createdAt?: string
  updatedAt?: string
}
