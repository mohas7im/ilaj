import { notFound } from "next/navigation"
import { PageHeader } from "@/components/admin/common/PageHeader"
import { ServiceDetails } from "@/features/admin/services/components/ServiceDetails"
import { MOCK_SERVICES } from "@/features/admin/services/config"

type Props = { params: Promise<{ id: string }> }

export default async function ServiceDetailPage({ params }: Props) {
  const { id } = await params
  const service = MOCK_SERVICES.find((s) => s.id === id)
  if (!service) notFound()

  return (
    <div className="space-y-6">
      <PageHeader
        title={service.name}
        description="Service details and configuration."
      />
      <div className="max-w-2xl mx-auto">
        <ServiceDetails service={service} />
      </div>
    </div>
  )
}
