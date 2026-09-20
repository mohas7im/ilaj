import {
  getClinicSettings,
  updateClinicSettings,
  DEFAULT_SETTINGS_RECORD,
} from "@/server/services/settings.service"
import type { ClinicSettings } from "../_types/settings.types"

export const CLINIC_SETTINGS: ClinicSettings = {
  ...DEFAULT_SETTINGS_RECORD,
}

export async function getSettings(): Promise<ClinicSettings> {
  return getClinicSettings()
}

export async function updateSettings(data: Partial<ClinicSettings>): Promise<ClinicSettings> {
  return updateClinicSettings(data)
}
