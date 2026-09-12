import { PageHeader } from "@/components/admin/PageHeader"
import { SettingsForm } from "./_components/SettingsForm"
import { getSettings } from "./_services/settings.service"

export const metadata = {
  title: "Clinic Settings",
}

export default async function SettingsPage() {
  const settings = await getSettings()

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
