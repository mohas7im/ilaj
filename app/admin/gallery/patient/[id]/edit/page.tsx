import { notFound } from "next/navigation"
import { PageHeader } from "@/components/admin/PageHeader"
import { PatientCaseForm } from "../../_components/PatientCaseForm"
import { getPatientCaseById } from "@/server/services/patient-case.service"

type Props = { params: Promise<{ id: string }> }

export const dynamic = "force-dynamic"
export const metadata = { title: "Edit Patient Case" }

export default async function PatientCaseEditPage({ params }: Props) {
  const { id } = await params
  const patientCase = await getPatientCaseById(id)
  if (!patientCase) notFound()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Patient Case"
        description={`Case: ${patientCase.heading}`}
        actions={[
          {
            label: "Back to Gallery",
            href: "/admin/gallery/patient",
            variant: "outline",
          },
        ]}
      />
      <div className="max-w-3xl mx-auto">
        <PatientCaseForm mode="edit" initialData={patientCase} />
      </div>
    </div>
  )
}
