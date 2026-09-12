export type ServiceStatus = "active" | "inactive"

export interface Service {
  id: string
  name: string
  slug?: string
  description?: string
  image?: string
  secondaryImage?: string
  status: ServiceStatus
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}
