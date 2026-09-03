import { notFound } from "next/navigation"
import { PageHeader } from "@/components/admin/common/PageHeader"
import { DoctorDetails } from "@/features/admin/doctors/components/DoctorDetails"
import { MOCK_DOCTORS } from "@/features/admin/doctors/config"

type Props = { params: Promise<{ id: string }> }

export default async function DoctorDetailPage({ params }: Props) {
  const { id } = await params
  const doctor = MOCK_DOCTORS.find((d) => d.id === id)
  if (!doctor) notFound()

  return (
    <div className="space-y-5">
      <PageHeader
        title={doctor.name}
        description={doctor.specialization}
        actions={[{ label: "Back", href: "/admin/doctors", variant: "outline" }]}
      />
      <div className="max-w-2xl">
        <DoctorDetails doctor={doctor} />
      </div>
    </div>
  )
}
