import { PageHeader } from "@/components/admin/PageHeader"
import { FaqsClientView } from "./_components/FaqsClientView"

export const metadata = {
  title: "FAQs | Admin",
}

export default function FaqsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="FAQs"
        description="General questions shown on the home page. Treatment FAQs are edited in each service."
        actions={[
          {
            label: "+ Add FAQ",
            href: "/admin/faqs/create",
          },
        ]}
      />
      <FaqsClientView />
    </div>
  )
}
