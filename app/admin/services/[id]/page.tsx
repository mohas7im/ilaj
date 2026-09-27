import { notFound } from "next/navigation"
import { PageHeader } from "@/components/admin/PageHeader"
import { ServiceDetails } from "../_components/ServiceDetails"
import { getServiceById } from "@/server/services/service.service"
import { getFaqs } from "@/server/services/faq.service"

type Props = { params: Promise<{ id: string }> }

export const dynamic = "force-dynamic"
export const metadata = { title: "View Service" }

export default async function ServiceDetailPage({ params }: Props) {
  const { id } = await params
  const [service, faqs] = await Promise.all([getServiceById(id), getFaqs({ serviceId: id })])

  if (!service) notFound()

  return (
    <div className="space-y-6">
      <PageHeader
        title={service.name}
        description="Detailed service overview, configuration, and media."
        actions={[
          {
            label: "Back to Services",
            href: "/admin/services",
            variant: "outline",
          },
          {
            label: "Edit Service",
            href: `/admin/services/${service.id}/edit`,
            variant: "default",
          },
        ]}
      />
      <div className="max-w-4xl mx-auto w-full">
        <ServiceDetails service={service} faqs={faqs} />
      </div>
    </div>
  )
}
