import { apiClient } from "@/lib/apiClient"
import type { Doctor } from "../_types/doctor.types"
import type { DoctorFormData } from "../_schemas/doctor.schema"

export const doctorApiService = {
  async getAll(): Promise<Doctor[]> {
    const { data } = await apiClient.get<Doctor[]>("/api/doctors")
    return data
  },

  async getById(id: string): Promise<Doctor> {
    const { data } = await apiClient.get<Doctor>(`/api/doctors/${id}`)
    return data
  },

  async create(payload: DoctorFormData): Promise<Doctor> {
    const { data } = await apiClient.post<Doctor>("/api/doctors", payload)
    return data
  },

  async update(id: string, payload: Partial<DoctorFormData>): Promise<Doctor> {
    const { data } = await apiClient.put<Doctor>(`/api/doctors/${id}`, payload)
    return data
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/doctors/${id}`)
  },
}
