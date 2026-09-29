export type ServiceStatus = "active" | "inactive"

/** A treatment's own FAQ (service_faqs table), in display order */
export interface ServiceFaq {
  id: string
  question: string
  answer: string
  displayOrder: number
}

export interface Service {
  id: string
  name: string
  slug: string
  description?: string | null
  details?: string | null
  image?: string | null
  imageAlt?: string | null
  secondaryImage?: string | null
  secondaryImageAlt?: string | null
  metaTitle?: string | null
  metaDescription?: string | null
  status: ServiceStatus
  displayOrder: number
  showInHomePage: boolean
  /** Only loaded for a single service (getServiceById) */
  faqs?: ServiceFaq[]
  isActive?: boolean
  createdAt?: string | Date
  updatedAt?: string | Date
}
