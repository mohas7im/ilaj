import { apiClient } from "@/lib/api/client"
import { ENDPOINTS } from "@/lib/api/endpoints"
import type { ClinicSettings } from "@/domain/settings/settings.types"

export const settingsApiService = {
  async get(): Promise<ClinicSettings> {
    const { data } = await apiClient.get<ClinicSettings>(ENDPOINTS.admin.settings)
    return data
  },

  async update(payload: ClinicSettings): Promise<ClinicSettings> {
    const { data } = await apiClient.put<ClinicSettings>(ENDPOINTS.admin.settings, payload)
    return data
  },
}
