import { PageHeader } from "@/components/admin/PageHeader"
import { SettingsForm } from "./_components/SettingsForm"
import { getClinicSettings, DEFAULT_SETTINGS_RECORD } from "@/server/services/settings.service"
import type { ClinicSettings } from "@/domain/settings/settings.types"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Clinic Settings",
}

export default async function SettingsPage() {
  let settings: ClinicSettings
  try {
    settings = await getClinicSettings()
  } catch (error) {
    console.error("Failed to load clinic settings on server:", error)
    settings = {
      ...DEFAULT_SETTINGS_RECORD,
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Configure your clinic contact details, marketing statistics, operating hours, and social media links."
      />
      <SettingsForm initialSettings={settings} />
    </div>
  )
}
