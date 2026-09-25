export type ServiceStatus = "active" | "inactive"

export interface Service {
  id: string
  name: string
  slug?: string
  description?: string | null
  image?: string | null
  imageAlt?: string | null
  secondaryImage?: string | null
  secondaryImageAlt?: string | null
  status: ServiceStatus
  displayOrder?: number
  showInHomePage?: boolean
  isActive?: boolean
  createdAt?: string | Date
  updatedAt?: string | Date
}
