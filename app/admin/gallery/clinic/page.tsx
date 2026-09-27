import { PageHeader } from "@/components/admin/PageHeader"
import { ClinicGalleryGrid } from "./_components/ClinicGalleryGrid"

export const metadata = {
  title: "Clinic Gallery | Admin",
}

export default function ClinicGalleryPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Clinic Gallery"
        description="Showcase clinic premises, facilities, and treatment rooms."
        actions={[
          {
            label: "+ Add Photo",
            href: "/admin/gallery/clinic/create",
          },
        ]}
      />
      <ClinicGalleryGrid />
    </div>
  )
}
