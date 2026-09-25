import { apiClient } from "@/lib/api/client"
import { ENDPOINTS } from "@/lib/api/endpoints"
import type { Doctor } from "../_types/doctor.types"
import type { DoctorFormData } from "../_schemas/doctor.schema"

export const doctorApiService = {
  async getAll(): Promise<Doctor[]> {
    const { data } = await apiClient.get<Doctor[]>(ENDPOINTS.admin.doctors.list)
    return data
  },

  async getById(id: string): Promise<Doctor> {
    const { data } = await apiClient.get<Doctor>(ENDPOINTS.admin.doctors.byId(id))
    return data
  },

  async create(payload: DoctorFormData | FormData): Promise<Doctor> {
    const { data } = await apiClient.post<Doctor>(ENDPOINTS.admin.doctors.list, payload)
    return data
  },

  async update(id: string, payload: Partial<DoctorFormData> | FormData): Promise<Doctor> {
    const { data } = await apiClient.put<Doctor>(ENDPOINTS.admin.doctors.byId(id), payload)
    return data
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.admin.doctors.byId(id))
  },
}
