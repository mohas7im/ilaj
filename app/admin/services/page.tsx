import { PageHeader } from "@/components/admin/PageHeader"
import { ServicesClientView } from "./_components/ServicesClientView"

export const metadata = {
  title: "Services | Admin",
}

export default function ServicesPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Services"
        description="Manage the dental services offered by the clinic."
        actions={[{ label: "+ Add Service", href: "/admin/services/create" }]}
      />
      <ServicesClientView />
    </div>
  )
}
