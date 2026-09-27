import { PageHeader } from "@/components/admin/PageHeader"
import { TestimonialsClientView } from "./_components/TestimonialsClientView"

export const metadata = {
  title: "Testimonials | Admin",
}

export default function TestimonialsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Testimonials"
        description="Patient reviews, ratings, and feedback displayed on the clinic website."
        actions={[
          {
            label: "+ Add Testimonial",
            href: "/admin/testimonials/create",
          },
        ]}
      />
      <TestimonialsClientView />
    </div>
  )
}
