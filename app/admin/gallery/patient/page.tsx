import { PageHeader } from "@/components/admin/PageHeader"
import { getPatientCases } from "@/server/services/patient-case.service"
import { PatientGalleryGrid } from "./_components/PatientGalleryGrid"

export const dynamic = "force-dynamic"
export const metadata = {
  title: "Patient Gallery | Admin",
}

export default async function PatientGalleryPage() {
  const cases = await getPatientCases()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Patient Gallery"
        description="Before & after smile transformations and case studies."
        actions={[
          {
            label: "+ Add Before & After",
            href: "/admin/gallery/patient/create",
          },
        ]}
      />
      <PatientGalleryGrid initialCases={cases} />
    </div>
  )
}
