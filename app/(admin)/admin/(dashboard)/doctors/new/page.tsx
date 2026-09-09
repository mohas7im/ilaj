import { PageHeader } from "@/components/admin/common/PageHeader"
import { DoctorForm } from "@/features/admin/doctors/components/DoctorForm"

export const metadata = { title: "Add Doctor" }

export default function NewDoctorPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Add Doctor"
        description="Create a new doctor profile."
      />
      <div className="max-w-2xl mx-auto">
        <DoctorForm />
      </div>
    </div>
  )
}
