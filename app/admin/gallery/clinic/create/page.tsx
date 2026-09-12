import { PageHeader } from "@/components/admin/PageHeader"
import { ClinicPhotoForm } from "../_components/ClinicPhotoForm"

export const metadata = { title: "Add Clinic Photo" }

export default function CreateClinicPhotoPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Add Clinic Photo"
        description="Upload a new photo showcasing clinic facilities, suites, and premises."
        actions={[
          {
            label: "Back to Gallery",
            href: "/admin/gallery/clinic",
            variant: "outline",
          },
        ]}
      />
      <div className="max-w-2xl mx-auto">
        <ClinicPhotoForm mode="create" />
      </div>
    </div>
  )
}
