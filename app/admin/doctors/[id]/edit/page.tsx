import { PageHeader } from "@/components/admin/PageHeader"
import { DoctorForm } from "../../_components/DoctorForm"

type Props = { params: Promise<{ id: string }> }

export const metadata = { title: "Edit Doctor" }

export default async function DoctorEditPage({ params }: Props) {
  const { id } = await params

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Doctor"
        description="Update doctor profile details, credentials, and practice information."
        actions={[
          {
            label: "Back to Doctors",
            href: "/admin/doctors",
            variant: "outline",
          },
        ]}
      />
      <div className="max-w-2xl mx-auto">
        <DoctorForm mode="edit" id={id} />
      </div>
    </div>
  )
}
