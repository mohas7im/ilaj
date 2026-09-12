import { notFound } from "next/navigation"
import { PageHeader } from "@/components/admin/PageHeader"
import { PatientForm } from "../../_components/PatientForm"
import { getPatientById } from "../../_services/patient.service"

type Props = { params: Promise<{ id: string }> }

export const metadata = { title: "Edit Patient" }

export default async function PatientEditPage({ params }: Props) {
  const { id } = await params
  const patient = await getPatientById(id)
  if (!patient) notFound()

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Edit ${patient.name}`}
        description="Update patient contact information and medical record."
      />
      <div className="max-w-2xl mx-auto">
        <PatientForm mode="edit" initialData={patient} />
      </div>
    </div>
  )
}
