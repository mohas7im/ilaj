import { PageHeader } from "@/components/admin/PageHeader"
import { FaqForm } from "../../_components/FaqForm"

type Props = { params: Promise<{ id: string }> }

export const metadata = { title: "Edit FAQ" }

export default async function FaqEditPage({ params }: Props) {
  const { id } = await params

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit FAQ"
        description="General question shown on the home page."
        actions={[
          {
            label: "Back to FAQs",
            href: "/admin/faqs",
            variant: "outline",
          },
        ]}
      />
      <div className="max-w-2xl mx-auto">
        <FaqForm mode="edit" id={id} />
      </div>
    </div>
  )
}
