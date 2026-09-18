import { notFound } from "next/navigation"
import { PageHeader } from "@/components/admin/PageHeader"
import { ServiceForm } from "../../_components/ServiceForm"
import { getServiceById } from "../../_services/service.service"

type Props = { params: Promise<{ id: string }> }

export const dynamic = "force-dynamic"
export const metadata = { title: "Edit Service" }


export default async function ServiceEditPage({ params }: Props) {
  const { id } = await params
  const service = await getServiceById(id)
  if (!service) notFound()

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Edit ${service.name}`}
        description="Update service details, status, and photos."
      />
      <div className="max-w-2xl mx-auto">
        <ServiceForm mode="edit" initialData={service} />
      </div>
    </div>
  )
}
