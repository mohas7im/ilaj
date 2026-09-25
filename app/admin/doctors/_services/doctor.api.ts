import { apiClient } from "@/lib/apiClient"
import type { Doctor } from "../_types/doctor.types"
import type { DoctorFormData } from "../_schemas/doctor.schema"

export const doctorApiService = {
  async getAll(): Promise<Doctor[]> {
    const { data } = await apiClient.get<Doctor[]>("/api/admin/doctors")
    return data
  },

  async getById(id: string): Promise<Doctor> {
    const { data } = await apiClient.get<Doctor>(`/api/admin/doctors/${id}`)
    return data
  },

  async create(payload: DoctorFormData | FormData): Promise<Doctor> {
    const { data } = await apiClient.post<Doctor>("/api/admin/doctors", payload)
    return data
  },

  async update(id: string, payload: Partial<DoctorFormData> | FormData): Promise<Doctor> {
    const { data } = await apiClient.put<Doctor>(`/api/admin/doctors/${id}`, payload)
    return data
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/admin/doctors/${id}`)
  },
}
