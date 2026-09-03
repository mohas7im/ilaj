import { PageHeader } from "@/components/admin/common/PageHeader"
import { ServiceForm } from "@/features/admin/services/components/ServiceForm"

export const metadata = { title: "Add Service" }

export default function NewServicePage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Add Service"
        description="Create a new dental service."
        actions={[{ label: "Back", href: "/admin/services", variant: "outline" }]}
      />
      <div className="max-w-2xl">
        <ServiceForm />
      </div>
    </div>
  )
}
