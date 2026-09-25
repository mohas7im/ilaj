import { apiClient } from "@/lib/api/client"
import { ENDPOINTS } from "@/lib/api/endpoints"
import type { Testimonial } from "@/domain/testimonial/testimonial.types"
import type { TestimonialFormData } from "@/domain/testimonial/testimonial.schema"

export const testimonialApiService = {
  async getAll(): Promise<Testimonial[]> {
    const { data } = await apiClient.get<Testimonial[]>(ENDPOINTS.admin.testimonials.list)
    return data
  },

  async getById(id: string): Promise<Testimonial> {
    const { data } = await apiClient.get<Testimonial>(ENDPOINTS.admin.testimonials.byId(id))
    return data
  },

  async create(payload: TestimonialFormData): Promise<Testimonial> {
    const { data } = await apiClient.post<Testimonial>(ENDPOINTS.admin.testimonials.list, payload)
    return data
  },

  async update(id: string, payload: Partial<TestimonialFormData>): Promise<Testimonial> {
    const { data } = await apiClient.put<Testimonial>(ENDPOINTS.admin.testimonials.byId(id), payload)
    return data
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.admin.testimonials.byId(id))
  },
}
