export interface Patient {
  id: string
  name: string
  email?: string
  phone?: string
  dateOfBirth?: string
  gender?: "male" | "female" | "other"
  address?: string
  medicalHistory?: string
  createdAt?: string
  updatedAt?: string
}
