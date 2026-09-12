export type ServiceStatus = "active" | "inactive"

export interface Service {
  id: string
  name: string
  slug?: string
  description?: string
  image?: string
  imageAlt?: string
  secondaryImage?: string
  secondaryImageAlt?: string
  status: ServiceStatus
  displayOrder?: number
  showInHomePage?: boolean
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}
