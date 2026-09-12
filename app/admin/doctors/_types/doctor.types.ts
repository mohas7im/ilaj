export interface Doctor {
  id: string
  name: string
  designation: string
  specialization: string
  bio?: string
  image?: string
  imageAlt?: string
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}
