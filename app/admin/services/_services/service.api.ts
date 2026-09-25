import { apiClient } from "@/lib/api/client"
import { ENDPOINTS } from "@/lib/api/endpoints"
import type { Service } from "@/domain/service/service.types"
import type { ServiceFormData } from "@/domain/service/service.schema"

export const serviceApiService = {
  async getAll(): Promise<Service[]> {
    const { data } = await apiClient.get<Service[]>(ENDPOINTS.admin.services.list)
    return data
  },

  async getById(id: string): Promise<Service> {
    const { data } = await apiClient.get<Service>(ENDPOINTS.admin.services.byId(id))
    return data
  },

  async create(payload: ServiceFormData | FormData): Promise<Service> {
    const { data } = await apiClient.post<Service>(ENDPOINTS.admin.services.list, payload)
    return data
  },

  async update(id: string, payload: Partial<ServiceFormData> | FormData): Promise<Service> {
    const { data } = await apiClient.put<Service>(ENDPOINTS.admin.services.byId(id), payload)
    return data
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.admin.services.byId(id))
  },
}
