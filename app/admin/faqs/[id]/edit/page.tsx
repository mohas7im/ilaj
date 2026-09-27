import { notFound } from "next/navigation"
import { PageHeader } from "@/components/admin/PageHeader"
import { getFaqById } from "@/server/services/faq.service"
import { FaqForm } from "../../_components/FaqForm"

type Props = { params: Promise<{ id: string }> }

export const dynamic = "force-dynamic"
export const metadata = { title: "Edit FAQ" }

export default async function FaqEditPage({ params }: Props) {
  const { id } = await params
  const faq = await getFaqById(id)
  if (!faq) notFound()

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
        <FaqForm mode="edit" initialData={faq} />
      </div>
    </div>
  )
}
