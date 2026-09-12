import { PageHeader } from "@/components/admin/common/PageHeader"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/admin/ui/card"
import { Button } from "@/components/admin/ui/button"
import { Badge } from "@/components/admin/ui/badge"
import { Upload, Image as ImageIcon } from "lucide-react"

export const metadata = { title: "Clinic Gallery" }

const MOCK_CLINIC_PHOTOS = [
  {
    id: "1",
    title: "Reception & Waiting Lounge",
    category: "Interior",
    date: "2024-08-15",
    description: "Modern patient waiting area and front desk.",
  },
  {
    id: "2",
    title: "Operation Theatre & Dental Chairs",
    category: "Equipment",
    date: "2024-08-10",
    description: "Sterilized dental unit with digital imaging equipment.",
  },
  {
    id: "3",
    title: "Sterilization Room",
    category: "Hygiene",
    date: "2024-07-28",
    description: "Autoclave sterilizers and surgical prep area.",
  },
  {
    id: "4",
    title: "Digital X-Ray Suite",
    category: "Diagnostics",
    date: "2024-07-20",
    description: "Low-radiation panoramic OPG dental scanner.",
  },
]

export default function ClinicGalleryPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Clinic Gallery"
        description="Manage clinic premises, facilities, and equipment photos."
        actions={[
          {
            label: "+ Upload Photo",
            href: "/admin/gallery/clinic/upload",
          },
        ]}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_CLINIC_PHOTOS.map((photo) => (
          <Card key={photo.id} className="overflow-hidden">
            <div className="flex h-44 items-center justify-center bg-muted/60 border-b">
              <div className="flex flex-col items-center gap-1.5 text-muted-foreground">
                <ImageIcon className="h-8 w-8" />
                <span className="text-xs">{photo.category}</span>
              </div>
            </div>
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{photo.category}</Badge>
                <span className="text-xs text-muted-foreground">{photo.date}</span>
              </div>
              <CardTitle className="text-base pt-1">{photo.title}</CardTitle>
              <CardDescription>{photo.description}</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-2 flex justify-end gap-2">
              <Button variant="outline" size="sm">
                Edit
              </Button>
              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
