import { PageHeader } from "@/components/admin/PageHeader"
import { DoctorTable } from "./_components/DoctorTable"

export const metadata = {
  title: "Doctors | Admin",
}

export default function DoctorsPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Doctors"
        description="Manage clinic doctors and practitioners."
        actions={[{ label: "+ Add Doctor", href: "/admin/doctors/create" }]}
      />
      <DoctorTable />
    </div>
  )
}
