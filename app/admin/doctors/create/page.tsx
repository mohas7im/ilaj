import { PageHeader } from "@/components/admin/PageHeader"
import { DoctorForm } from "../_components/DoctorForm"

export const metadata = { title: "Add Doctor" }

export default function CreateDoctorPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Add Doctor"
        description="Add a new practitioner or specialist to the clinic team."
      />
      <div className="max-w-2xl mx-auto">
        <DoctorForm mode="create" />
      </div>
    </div>
  )
}
