import { apiClient } from "@/lib/api/client"
import { ENDPOINTS } from "@/lib/api/endpoints"
import type { WhyChooseUsItem } from "../_types/why-choose-us.types"
import type { WhyChooseUsItemFormData } from "../_schemas/why-choose-us.schema"

export const whyChooseUsApiService = {
  async getAll(): Promise<WhyChooseUsItem[]> {
    const { data } = await apiClient.get<WhyChooseUsItem[]>(ENDPOINTS.admin.whyChooseUs.list)
    return data
  },

  async getById(id: string): Promise<WhyChooseUsItem> {
    const { data } = await apiClient.get<WhyChooseUsItem>(ENDPOINTS.admin.whyChooseUs.byId(id))
    return data
  },

  async create(payload: WhyChooseUsItemFormData): Promise<WhyChooseUsItem> {
    const { data } = await apiClient.post<WhyChooseUsItem>(ENDPOINTS.admin.whyChooseUs.list, payload)
    return data
  },

  async update(id: string, payload: Partial<WhyChooseUsItemFormData>): Promise<WhyChooseUsItem> {
    const { data } = await apiClient.put<WhyChooseUsItem>(ENDPOINTS.admin.whyChooseUs.byId(id), payload)
    return data
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.admin.whyChooseUs.byId(id))
  },
}
