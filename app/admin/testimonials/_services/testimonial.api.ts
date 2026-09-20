import { apiClient } from "@/lib/apiClient"
import type { Testimonial } from "../_types/testimonial.types"
import type { TestimonialFormData } from "../_schemas/testimonial.schema"

export const testimonialApiService = {
  async getAll(): Promise<Testimonial[]> {
    const { data } = await apiClient.get<Testimonial[]>("/api/testimonials")
    return data
  },

  async getById(id: string): Promise<Testimonial> {
    const { data } = await apiClient.get<Testimonial>(`/api/testimonials/${id}`)
    return data
  },

  async create(payload: TestimonialFormData): Promise<Testimonial> {
    const { data } = await apiClient.post<Testimonial>("/api/testimonials", payload)
    return data
  },

  async update(id: string, payload: Partial<TestimonialFormData>): Promise<Testimonial> {
    const { data } = await apiClient.put<Testimonial>(`/api/testimonials/${id}`, payload)
    return data
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/testimonials/${id}`)
  },
}
