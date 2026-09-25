import { apiClient } from "@/lib/apiClient"
import type { ClinicPhoto } from "../_types/clinic-photo.types"
import type { ClinicPhotoInput } from "../_schemas/clinic-photo.schema"

export const clinicPhotoApiService = {
  async getAll(): Promise<ClinicPhoto[]> {
    const { data } = await apiClient.get<ClinicPhoto[]>("/api/admin/gallery/clinic")
    return data
  },

  async getById(id: string): Promise<ClinicPhoto> {
    const { data } = await apiClient.get<ClinicPhoto>(`/api/admin/gallery/clinic/${id}`)
    return data
  },

  async create(payload: ClinicPhotoInput | FormData): Promise<ClinicPhoto> {
    const { data } = await apiClient.post<ClinicPhoto>("/api/admin/gallery/clinic", payload)
    return data
  },

  async update(id: string, payload: Partial<ClinicPhotoInput> | FormData): Promise<ClinicPhoto> {
    const { data } = await apiClient.put<ClinicPhoto>(`/api/admin/gallery/clinic/${id}`, payload)
    return data
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/admin/gallery/clinic/${id}`)
  },
}
