import { apiClient } from "@/lib/apiClient"
import type { ClinicSettings } from "../_types/settings.types"

export const settingsApiService = {
  async get(): Promise<ClinicSettings> {
    const { data } = await apiClient.get<ClinicSettings>("/api/admin/settings")
    return data
  },

  async update(payload: ClinicSettings): Promise<ClinicSettings> {
    const { data } = await apiClient.put<ClinicSettings>("/api/admin/settings", payload)
    return data
  },
}
