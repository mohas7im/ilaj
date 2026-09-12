import { PageHeader } from "@/components/admin/PageHeader"
import { PatientForm } from "../_components/PatientForm"

export const metadata = { title: "Add Patient" }

export default function CreatePatientPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Register Patient"
        description="Add a new patient profile and dental record."
      />
      <div className="max-w-2xl mx-auto">
        <PatientForm mode="create" />
      </div>
    </div>
  )
}
