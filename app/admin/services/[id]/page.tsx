import { PageHeader } from "@/components/admin/PageHeader"
import { ServiceDetails } from "../_components/ServiceDetails"

type Props = { params: Promise<{ id: string }> }

export const metadata = { title: "View Service" }

export default async function ServiceDetailPage({ params }: Props) {
  const { id } = await params

  return (
    <div className="space-y-6">
      <PageHeader
        title="View Service"
        description="Detailed service overview, configuration, and media."
        actions={[
          {
            label: "Back to Services",
            href: "/admin/services",
            variant: "outline",
          },
          {
            label: "Edit Service",
            href: `/admin/services/${id}/edit`,
            variant: "default",
          },
        ]}
      />
      <div className="max-w-4xl mx-auto w-full">
        <ServiceDetails id={id} />
      </div>
    </div>
  )
}
