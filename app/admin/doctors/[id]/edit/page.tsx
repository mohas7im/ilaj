import { notFound } from "next/navigation"
import { PageHeader } from "@/components/admin/PageHeader"
import { DoctorForm } from "../../_components/DoctorForm"
import { getDoctorById } from "../../_services/doctor.service"

type Props = { params: Promise<{ id: string }> }

export const metadata = { title: "Edit Doctor" }

export default async function DoctorEditPage({ params }: Props) {
  const { id } = await params
  const doctor = await getDoctorById(id)
  if (!doctor) notFound()

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
        <DoctorForm mode="edit" initialData={doctor} />
      </div>
    </div>
  )
}
