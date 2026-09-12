import { notFound } from "next/navigation"
import { PageHeader } from "@/components/admin/PageHeader"
import { TestimonialForm } from "../../_components/TestimonialForm"
import { getTestimonialById } from "../../_services/testimonial.service"

type Props = { params: Promise<{ id: string }> }

export const metadata = { title: "Edit Testimonial" }

export default async function TestimonialEditPage({ params }: Props) {
  const { id } = await params
  const testimonial = await getTestimonialById(id)
  if (!testimonial) notFound()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Testimonial"
        description={`Patient: ${testimonial.patientName} • ${testimonial.treatment}`}
      />
      <div className="max-w-2xl mx-auto">
        <TestimonialForm mode="edit" initialData={testimonial} />
      </div>
    </div>
  )
}
