import { PageHeader } from "@/components/admin/PageHeader"
import { getClinicPhotos } from "@/server/services/clinic-photo.service"
import { ClinicGalleryGrid } from "./_components/ClinicGalleryGrid"

export const dynamic = "force-dynamic"
export const metadata = {
  title: "Clinic Gallery | Admin",
}

export default async function ClinicGalleryPage() {
  const photos = await getClinicPhotos()

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
      <ClinicGalleryGrid initialPhotos={photos} />
    </div>
  )
}
