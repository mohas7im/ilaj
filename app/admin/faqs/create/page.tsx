import { PageHeader } from "@/components/admin/PageHeader"
import { FaqForm } from "../_components/FaqForm"

export const metadata = { title: "Add FAQ" }

export default function CreateFaqPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Add FAQ"
        description="Add a general question and answer for the home page."
        actions={[
          {
            label: "Back to FAQs",
            href: "/admin/faqs",
            variant: "outline",
          },
        ]}
      />
      <div className="max-w-2xl mx-auto">
        <FaqForm mode="create" />
      </div>
    </div>
  )
}
