import { apiClient } from "@/lib/apiClient"
import type { WhyChooseUsItem } from "../_types/why-choose-us.types"
import type { WhyChooseUsItemFormData } from "../_schemas/why-choose-us.schema"

export const whyChooseUsApiService = {
  async getAll(): Promise<WhyChooseUsItem[]> {
    const { data } = await apiClient.get<WhyChooseUsItem[]>("/api/why-choose-us")
    return data
  },

  async getById(id: string): Promise<WhyChooseUsItem> {
    const { data } = await apiClient.get<WhyChooseUsItem>(`/api/why-choose-us/${id}`)
    return data
  },

  async create(payload: WhyChooseUsItemFormData): Promise<WhyChooseUsItem> {
    const { data } = await apiClient.post<WhyChooseUsItem>("/api/why-choose-us", payload)
    return data
  },

  async update(id: string, payload: Partial<WhyChooseUsItemFormData>): Promise<WhyChooseUsItem> {
    const { data } = await apiClient.put<WhyChooseUsItem>(`/api/why-choose-us/${id}`, payload)
    return data
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/why-choose-us/${id}`)
  },
}
