import { PageHeader } from "@/components/admin/PageHeader"
import { ServiceForm } from "../_components/ServiceForm"

export const metadata = { title: "Add Service" }

export default function CreateServicePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Add Service"
        description="Create a new dental service."
      />
      <div className="max-w-2xl mx-auto">
        <ServiceForm mode="create" />
      </div>
    </div>
  )
}
