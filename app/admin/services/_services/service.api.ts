import { apiClient } from "@/lib/apiClient"
import type { Service } from "../_types/service.types"
import type { ServiceFormData } from "../_schemas/service.schema"

export const serviceApiService = {
  async getAll(): Promise<Service[]> {
    const { data } = await apiClient.get<Service[]>("/api/services")
    return data
  },

  async getById(id: string): Promise<Service> {
    const { data } = await apiClient.get<Service>(`/api/services/${id}`)
    return data
  },

  async create(payload: ServiceFormData): Promise<Service> {
    const { data } = await apiClient.post<Service>("/api/services", payload)
    return data
  },

  async update(id: string, payload: Partial<ServiceFormData>): Promise<Service> {
    const { data } = await apiClient.put<Service>(`/api/services/${id}`, payload)
    return data
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/services/${id}`)
  },
}
