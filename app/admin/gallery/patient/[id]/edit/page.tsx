import { PageHeader } from "@/components/admin/PageHeader"
import { PatientCaseForm } from "../../_components/PatientCaseForm"

type Props = { params: Promise<{ id: string }> }

export const metadata = { title: "Edit Patient Case" }

export default async function PatientCaseEditPage({ params }: Props) {
  const { id } = await params

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Patient Case"
        description="Update the before & after case details."
        actions={[
          {
            label: "Back to Gallery",
            href: "/admin/gallery/patient",
            variant: "outline",
          },
        ]}
      />
      <div className="max-w-3xl mx-auto">
        <PatientCaseForm mode="edit" id={id} />
      </div>
    </div>
  )
}
