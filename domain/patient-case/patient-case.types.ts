export type PatientCase = {
  id: string
  heading: string
  description?: string | null
  beforeImage: string
  afterImage: string
  beforeAlt: string
  afterAlt: string
  displayOrder?: number
  createdAt?: string
  updatedAt?: string
}
