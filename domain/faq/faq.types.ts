export type FaqStatus = "published" | "draft"

export interface Faq {
  id: string
  question: string
  answer: string
  /** null = General FAQ (home page), otherwise the treatment it belongs to */
  serviceId: string | null
  serviceName: string | null
  status: FaqStatus
  displayOrder: number
  createdAt?: string
  updatedAt?: string
}
