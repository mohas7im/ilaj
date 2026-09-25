import { apiClient } from "@/lib/api/client"
import { ENDPOINTS } from "@/lib/api/endpoints"
import type { PatientCase } from "../_types/patient-case.types"
import type { PatientCaseInput } from "../_schemas/patient-case.schema"

export const patientCaseApiService = {
  async getAll(): Promise<PatientCase[]> {
    const { data } = await apiClient.get<PatientCase[]>(ENDPOINTS.admin.gallery.patient.list)
    return data
  },

  async getById(id: string): Promise<PatientCase> {
    const { data } = await apiClient.get<PatientCase>(ENDPOINTS.admin.gallery.patient.byId(id))
    return data
  },

  async create(payload: PatientCaseInput | FormData): Promise<PatientCase> {
    const { data } = await apiClient.post<PatientCase>(ENDPOINTS.admin.gallery.patient.list, payload)
    return data
  },

  async update(id: string, payload: Partial<PatientCaseInput> | FormData): Promise<PatientCase> {
    const { data } = await apiClient.put<PatientCase>(ENDPOINTS.admin.gallery.patient.byId(id), payload)
    return data
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.admin.gallery.patient.byId(id))
  },
}
