import { apiClient } from "@/lib/api/client"
import { ENDPOINTS } from "@/lib/api/endpoints"
import type { Faq } from "@/domain/faq/faq.types"
import type { FaqFormData } from "@/domain/faq/faq.schema"

export const faqApiService = {
  async getAll(): Promise<Faq[]> {
    const { data } = await apiClient.get<Faq[]>(ENDPOINTS.admin.faqs.list)
    return data
  },

  async create(payload: FaqFormData): Promise<Faq> {
    const { data } = await apiClient.post<Faq>(ENDPOINTS.admin.faqs.list, payload)
    return data
  },

  async update(id: string, payload: FaqFormData): Promise<Faq> {
    const { data } = await apiClient.put<Faq>(ENDPOINTS.admin.faqs.byId(id), payload)
    return data
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.admin.faqs.byId(id))
  },
}
