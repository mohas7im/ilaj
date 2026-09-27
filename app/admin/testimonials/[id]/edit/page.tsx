import { PageHeader } from "@/components/admin/PageHeader"
import { TestimonialForm } from "../../_components/TestimonialForm"

type Props = { params: Promise<{ id: string }> }

export const metadata = { title: "Edit Testimonial" }

export default async function TestimonialEditPage({ params }: Props) {
  const { id } = await params

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Testimonial"
        description="Update patient review and feedback details."
        actions={[
          {
            label: "Back to Testimonials",
            href: "/admin/testimonials",
            variant: "outline",
          },
        ]}
      />
      <div className="max-w-2xl mx-auto">
        <TestimonialForm mode="edit" id={id} />
      </div>
    </div>
  )
}
