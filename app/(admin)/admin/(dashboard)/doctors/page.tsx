import { PageHeader } from "@/components/admin/common/PageHeader"
import { DoctorTable } from "@/features/admin/doctors/components/DoctorTable"
import { MOCK_DOCTORS } from "@/features/admin/doctors/config"

export const metadata = { title: "Doctors" }

export default function DoctorsPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Doctors"
        description="Manage clinic doctors and practitioners."
        actions={[{ label: "+ Add Doctor", href: "/admin/doctors/new" }]}
      />
      <DoctorTable doctors={MOCK_DOCTORS} />
    </div>
  )
}
