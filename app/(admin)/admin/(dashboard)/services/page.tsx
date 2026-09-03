import { PageHeader } from "@/components/admin/common/PageHeader"
import { ServiceTable } from "@/features/admin/services/components/ServiceTable"
import { MOCK_SERVICES } from "@/features/admin/services/config"

export const metadata = { title: "Services" }

export default function ServicesPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Services"
        description="Manage the dental services offered by the clinic."
        actions={[{ label: "+ Add Service", href: "/admin/services/new" }]}
      />
      <ServiceTable services={MOCK_SERVICES} />
    </div>
  )
}
