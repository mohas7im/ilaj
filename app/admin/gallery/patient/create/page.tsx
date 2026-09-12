import { PageHeader } from "@/components/admin/PageHeader"
import { PatientCaseForm } from "../_components/PatientCaseForm"

export const metadata = { title: "Add Patient Case" }

export default function CreatePatientCasePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Add Before & After Case"
        description="Upload before and after photos showcasing smile transformations and clinical outcomes."
        actions={[
          {
            label: "Back to Gallery",
            href: "/admin/gallery/patient",
            variant: "outline",
          },
        ]}
      />
      <div className="max-w-3xl mx-auto">
        <PatientCaseForm mode="create" />
      </div>
    </div>
  )
}
