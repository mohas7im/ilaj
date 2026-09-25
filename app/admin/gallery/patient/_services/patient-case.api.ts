import { apiClient } from "@/lib/apiClient"
import type { PatientCase } from "../_types/patient-case.types"
import type { PatientCaseInput } from "../_schemas/patient-case.schema"

export const patientCaseApiService = {
  async getAll(): Promise<PatientCase[]> {
    const { data } = await apiClient.get<PatientCase[]>("/api/admin/gallery/patient")
    return data
  },

  async getById(id: string): Promise<PatientCase> {
    const { data } = await apiClient.get<PatientCase>(`/api/admin/gallery/patient/${id}`)
    return data
  },

  async create(payload: PatientCaseInput | FormData): Promise<PatientCase> {
    const { data } = await apiClient.post<PatientCase>("/api/admin/gallery/patient", payload)
    return data
  },

  async update(id: string, payload: Partial<PatientCaseInput> | FormData): Promise<PatientCase> {
    const { data } = await apiClient.put<PatientCase>(`/api/admin/gallery/patient/${id}`, payload)
    return data
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/admin/gallery/patient/${id}`)
  },
}
