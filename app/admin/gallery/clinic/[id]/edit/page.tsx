import { notFound } from "next/navigation"
import { PageHeader } from "@/components/admin/PageHeader"
import { ClinicPhotoForm } from "../../_components/ClinicPhotoForm"
import { getClinicPhotoById } from "../../_services/clinic-photo.service"

type Props = { params: Promise<{ id: string }> }

export const metadata = { title: "Edit Clinic Photo" }

export default async function ClinicPhotoEditPage({ params }: Props) {
  const { id } = await params
  const photo = await getClinicPhotoById(id)
  if (!photo) notFound()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Clinic Photo"
        description={`Photo: ${photo.heading}`}
        actions={[
          {
            label: "Back to Gallery",
            href: "/admin/gallery/clinic",
            variant: "outline",
          },
        ]}
      />
      <div className="max-w-2xl mx-auto">
        <ClinicPhotoForm mode="edit" initialData={photo} />
      </div>
    </div>
  )
}
