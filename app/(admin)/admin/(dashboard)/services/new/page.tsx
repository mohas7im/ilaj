import { PageHeader } from "@/components/admin/common/PageHeader"
import { ServiceForm } from "@/features/admin/services/components/ServiceForm"

export const metadata = { title: "Add Service" }

export default function NewServicePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Add Service"
        description="Create a new dental service."
      />
      <div className="max-w-2xl mx-auto">
        <ServiceForm />
      </div>
    </div>
  )
}
