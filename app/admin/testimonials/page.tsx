import { PageHeader } from "@/components/admin/PageHeader"
import { getTestimonials } from "@/server/services/testimonial.service"
import { TestimonialsClientView } from "./_components/TestimonialsClientView"

export const dynamic = "force-dynamic"
export const metadata = {
  title: "Testimonials | Admin",
}

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials()

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
      <TestimonialsClientView initialTestimonials={testimonials} />
    </div>
  )
}
