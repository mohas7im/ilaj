import { PageHeader } from "@/components/admin/PageHeader"
import { SettingsForm } from "./_components/SettingsForm"

export const metadata = {
  title: "Clinic Settings",
}

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Configure your clinic contact details, marketing statistics, operating hours, and social media links."
      />
      <SettingsForm />
    </div>
  )
}
