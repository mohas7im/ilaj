import { PageHeader } from "@/components/admin/PageHeader"
import { getDoctors } from "@/server/services/doctor.service"
import { DoctorTable } from "./_components/DoctorTable"

export const dynamic = "force-dynamic"
export const metadata = {
  title: "Doctors | Admin",
}

export default async function DoctorsPage() {
  const doctors = await getDoctors()

  return (
    <div className="space-y-5">
      <PageHeader
        title="Doctors"
        description="Manage clinic doctors and practitioners."
        actions={[{ label: "+ Add Doctor", href: "/admin/doctors/create" }]}
      />
      <DoctorTable doctors={doctors} />
    </div>
  )
}
