import { apiClient } from "@/lib/apiClient"
import type { Service } from "../_types/service.types"
import type { ServiceFormData } from "../_schemas/service.schema"

export const serviceApiService = {
  async getAll(): Promise<Service[]> {
    const { data } = await apiClient.get<Service[]>("/api/admin/services")
    return data
  },

  async getById(id: string): Promise<Service> {
    const { data } = await apiClient.get<Service>(`/api/admin/services/${id}`)
    return data
  },

  async create(payload: ServiceFormData | FormData): Promise<Service> {
    const { data } = await apiClient.post<Service>("/api/admin/services", payload)
    return data
  },

  async update(id: string, payload: Partial<ServiceFormData> | FormData): Promise<Service> {
    const { data } = await apiClient.put<Service>(`/api/admin/services/${id}`, payload)
    return data
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/admin/services/${id}`)
  },
}
