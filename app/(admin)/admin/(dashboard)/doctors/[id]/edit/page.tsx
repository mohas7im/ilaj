import { notFound } from "next/navigation"
import { PageHeader } from "@/components/admin/common/PageHeader"
import { DoctorForm } from "@/features/admin/doctors/components/DoctorForm"
import { MOCK_DOCTORS } from "@/features/admin/doctors/config"

type Props = { params: Promise<{ id: string }> }

export default async function DoctorEditPage({ params }: Props) {
  const { id } = await params
  const doctor = MOCK_DOCTORS.find((d) => d.id === id)
  if (!doctor) notFound()

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Edit ${doctor.name}`}
        description={`${doctor.designation} • ${doctor.specialization}`}
      />
      <div className="max-w-2xl mx-auto">
        <DoctorForm doctor={doctor} />
      </div>
    </div>
  )
}
