export interface Inquiry {
  id: string
  fullName: string
  phone: string
  email: string
  treatment: string
  preferredDate: string
  preferredTime: string
  message: string
  createdAt: string
  /** Backward compatibility aliases */
  name?: string
  subject?: string
  status?: string
}
