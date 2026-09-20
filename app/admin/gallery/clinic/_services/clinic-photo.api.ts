import { apiClient } from "@/lib/apiClient"
import type { ClinicPhoto } from "../_types/clinic-photo.types"
import type { ClinicPhotoInput } from "../_schemas/clinic-photo.schema"

export const clinicPhotoApiService = {
  async getAll(): Promise<ClinicPhoto[]> {
    const { data } = await apiClient.get<ClinicPhoto[]>("/api/gallery/clinic")
    return data
  },

  async getById(id: string): Promise<ClinicPhoto> {
    const { data } = await apiClient.get<ClinicPhoto>(`/api/gallery/clinic/${id}`)
    return data
  },

  async create(payload: ClinicPhotoInput): Promise<ClinicPhoto> {
    const { data } = await apiClient.post<ClinicPhoto>("/api/gallery/clinic", payload)
    return data
  },

  async update(id: string, payload: Partial<ClinicPhotoInput>): Promise<ClinicPhoto> {
    const { data } = await apiClient.put<ClinicPhoto>(`/api/gallery/clinic/${id}`, payload)
    return data
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/gallery/clinic/${id}`)
  },
}
