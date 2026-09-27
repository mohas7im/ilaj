import { PageHeader } from "@/components/admin/PageHeader"
import { getFaqs } from "@/server/services/faq.service"
import { FaqsClientView } from "./_components/FaqsClientView"

export const dynamic = "force-dynamic"
export const metadata = {
  title: "FAQs | Admin",
}

export default async function FaqsPage() {
  const faqs = await getFaqs()

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
      <FaqsClientView initialFaqs={faqs} />
    </div>
  )
}
