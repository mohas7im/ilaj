import { PageHeader } from "@/components/admin/PageHeader"
import { PatientGalleryGrid } from "./_components/PatientGalleryGrid"

export const metadata = {
  title: "Patient Gallery | Admin",
}

export default function PatientGalleryPage() {
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
      <PatientGalleryGrid />
    </div>
  )
}
