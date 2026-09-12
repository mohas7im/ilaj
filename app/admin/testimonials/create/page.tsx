import { PageHeader } from "@/components/admin/PageHeader"
import { TestimonialForm } from "../_components/TestimonialForm"

export const metadata = { title: "Add Testimonial" }

export default function CreateTestimonialPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Add Testimonial"
        description="Add a new patient review and rating."
      />
      <div className="max-w-2xl mx-auto">
        <TestimonialForm mode="create" />
      </div>
    </div>
  )
}
