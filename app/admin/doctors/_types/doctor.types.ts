export interface Doctor {
  id: string
  name: string
  designation: string
  specialization: string
  bio?: string | null
  image?: string | null
  imageAlt?: string | null
  isActive?: boolean
  displayOrder?: number
  createdAt?: string | Date
  updatedAt?: string | Date
}
