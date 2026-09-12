import { PageHeader } from "@/components/admin/common/PageHeader"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/admin/ui/card"
import { Button } from "@/components/admin/ui/button"
import { Badge } from "@/components/admin/ui/badge"
import { ArrowRight, Sparkles } from "lucide-react"

export const metadata = { title: "Patient Gallery" }

const MOCK_PATIENT_CASES = [
  {
    id: "1",
    treatment: "Teeth Alignment & Invisalign",
    patientAge: "28 yrs",
    duration: "6 months",
    status: "Completed",
    notes: "Full smile makeover with invisible aligners and teeth whitening.",
  },
  {
    id: "2",
    treatment: "Dental Implants & Crown",
    patientAge: "45 yrs",
    duration: "3 months",
    status: "Completed",
    notes: "Replaced missing molar with titanium implant and ceramic crown.",
  },
  {
    id: "3",
    treatment: "Porcelain Veneers",
    patientAge: "34 yrs",
    duration: "2 weeks",
    status: "Completed",
    notes: "Upper front 6 teeth veneers for discoloration and gaps correction.",
  },
]

export default function PatientGalleryPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Patient Gallery"
        description="Showcase smile transformations, before & after case studies, and testimonials."
        actions={[
          {
            label: "+ Add Case Study",
            href: "/admin/gallery/patient/new",
          },
        ]}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_PATIENT_CASES.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="grid grid-cols-2 h-44 border-b divide-x">
              <div className="flex flex-col items-center justify-center bg-muted/40 p-2 text-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Before</span>
                <span className="text-[10px] text-muted-foreground mt-1">Pre-treatment</span>
              </div>
              <div className="flex flex-col items-center justify-center bg-primary/5 p-2 text-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> After
                </span>
                <span className="text-[10px] text-muted-foreground mt-1">Post-treatment</span>
              </div>
            </div>
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline">{item.status}</Badge>
                <span className="text-xs text-muted-foreground">{item.duration}</span>
              </div>
              <CardTitle className="text-base pt-1">{item.treatment}</CardTitle>
              <CardDescription>{item.notes}</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-2 flex justify-between items-center text-xs text-muted-foreground">
              <span>Patient Age: {item.patientAge}</span>
              <div className="flex gap-1">
                <Button variant="outline" size="sm">
                  View
                </Button>
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
