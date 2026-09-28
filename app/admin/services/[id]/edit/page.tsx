import { PageHeader } from "@/components/admin/PageHeader"
import { ServiceForm } from "../../_components/ServiceForm"

type Props = { params: Promise<{ id: string }> }

export const metadata = { title: "Edit Service" }

export default async function ServiceEditPage({ params }: Props) {
  const { id } = await params

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Service"
        description="Update service details, status, and photos."
      />
      <div className="max-w-4xl mx-auto">
        <ServiceForm mode="edit" id={id} />
      </div>
    </div>
  )
}
