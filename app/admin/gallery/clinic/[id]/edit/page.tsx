import { PageHeader } from "@/components/admin/PageHeader"
import { ClinicPhotoForm } from "../../_components/ClinicPhotoForm"

type Props = { params: Promise<{ id: string }> }

export const metadata = { title: "Edit Clinic Photo" }

export default async function ClinicPhotoEditPage({ params }: Props) {
  const { id } = await params

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Clinic Photo"
        description="Update the clinic gallery photo details."
        actions={[
          {
            label: "Back to Gallery",
            href: "/admin/gallery/clinic",
            variant: "outline",
          },
        ]}
      />
      <div className="max-w-2xl mx-auto">
        <ClinicPhotoForm mode="edit" id={id} />
      </div>
    </div>
  )
}
