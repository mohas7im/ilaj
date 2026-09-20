import { PageHeader } from "@/components/admin/PageHeader"
import { getServices } from "@/server/services/service.service"
import { ServicesClientView } from "./_components/ServicesClientView"

export const dynamic = "force-dynamic"
export const metadata = {
  title: "Services | Admin",
}

export default async function ServicesPage() {
  const services = await getServices()

  return (
    <div className="space-y-5">
      <PageHeader
        title="Services"
        description="Manage the dental services offered by the clinic."
        actions={[{ label: "+ Add Service", href: "/admin/services/create" }]}
      />
      <ServicesClientView initialServices={services} />
    </div>
  )
}
