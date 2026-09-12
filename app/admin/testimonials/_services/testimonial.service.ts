import type { Testimonial } from "../_types/testimonial.types"

export let MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    patientName: "Mohammed Adil",
    treatment: "Root Canal Treatment",
    rating: 4.5,
    review: "I was nervous about the root canal, but it was easier than expected. The doctor explained each step and ensured my comfort.",
    status: "published",
    createdAt: "2024-08-14T10:00:00Z",
  },
  {
    id: "t2",
    patientName: "Sarah Al-Mansoor",
    treatment: "Teeth Whitening",
    rating: 5.0,
    review: "Amazing experience! The results exceeded my expectations. The staff is polite, professional, and the clinic is spotless.",
    status: "published",
    createdAt: "2024-08-02T14:30:00Z",
  },
  {
    id: "t3",
    patientName: "Farhan Siddiqui",
    treatment: "Dental Implants",
    rating: 4.8,
    review: "State of the art technology and gentle hands. I got my implant done without any pain and recovery was very fast.",
    status: "published",
    createdAt: "2024-07-25T11:20:00Z",
  },
  {
    id: "t4",
    patientName: "Ayesha Khan",
    treatment: "Invisalign Alignment",
    rating: 5.0,
    review: "Clear guidance throughout my 6-month alignment journey. My smile transformation is incredible. Highly recommend Ilaj Dental!",
    status: "published",
    createdAt: "2024-07-10T16:00:00Z",
  },
]

export async function getTestimonials(): Promise<Testimonial[]> {
  return [...MOCK_TESTIMONIALS]
}

export async function getTestimonialById(id: string): Promise<Testimonial | undefined> {
  return MOCK_TESTIMONIALS.find((t) => t.id === id)
}

export async function createTestimonial(data: Omit<Testimonial, "id">): Promise<Testimonial> {
  const newTestimonial: Testimonial = {
    ...data,
    id: `t_${Date.now()}`,
    createdAt: new Date().toISOString(),
  }
  MOCK_TESTIMONIALS = [newTestimonial, ...MOCK_TESTIMONIALS]
  return newTestimonial
}

export async function updateTestimonial(id: string, data: Partial<Testimonial>): Promise<Testimonial | null> {
  const index = MOCK_TESTIMONIALS.findIndex((t) => t.id === id)
  if (index === -1) return null
  MOCK_TESTIMONIALS[index] = { ...MOCK_TESTIMONIALS[index], ...data }
  return MOCK_TESTIMONIALS[index]
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  const initialLen = MOCK_TESTIMONIALS.length
  MOCK_TESTIMONIALS = MOCK_TESTIMONIALS.filter((t) => t.id !== id)
  return MOCK_TESTIMONIALS.length < initialLen
}
