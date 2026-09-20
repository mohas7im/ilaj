export type TestimonialStatus = "published" | "draft"

export interface Testimonial {
  id: string
  patientName: string
  treatment: string
  rating: number
  review: string
  status: TestimonialStatus
  displayOrder?: number
  createdAt?: string
  updatedAt?: string
}
