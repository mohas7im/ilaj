import { apiClient } from "@/lib/api/client"
import { ENDPOINTS } from "@/lib/api/endpoints"
import type { ClinicPhoto } from "@/domain/clinic-photo/clinic-photo.types"
import type { ClinicPhotoInput } from "@/domain/clinic-photo/clinic-photo.schema"

export const clinicPhotoApiService = {
  async getAll(): Promise<ClinicPhoto[]> {
    const { data } = await apiClient.get<ClinicPhoto[]>(ENDPOINTS.admin.gallery.clinic.list)
    return data
  },

  async getById(id: string): Promise<ClinicPhoto> {
    const { data } = await apiClient.get<ClinicPhoto>(ENDPOINTS.admin.gallery.clinic.byId(id))
    return data
  },

  async create(payload: ClinicPhotoInput | FormData): Promise<ClinicPhoto> {
    const { data } = await apiClient.post<ClinicPhoto>(ENDPOINTS.admin.gallery.clinic.list, payload)
    return data
  },

  async update(id: string, payload: Partial<ClinicPhotoInput> | FormData): Promise<ClinicPhoto> {
    const { data } = await apiClient.put<ClinicPhoto>(ENDPOINTS.admin.gallery.clinic.byId(id), payload)
    return data
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.admin.gallery.clinic.byId(id))
  },
}
