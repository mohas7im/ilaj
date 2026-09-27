import { notFound } from "next/navigation"
import { PageHeader } from "@/components/admin/PageHeader"
import { getFaqById } from "@/server/services/faq.service"
import { getServices } from "@/server/services/service.service"
import { FaqForm } from "../../_components/FaqForm"

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ from?: string }>
}

export const dynamic = "force-dynamic"
export const metadata = { title: "Edit FAQ" }

export default async function FaqEditPage({ params, searchParams }: Props) {
  const [{ id }, { from }] = await Promise.all([params, searchParams])
  const [faq, services] = await Promise.all([getFaqById(id), getServices()])
  if (!faq) notFound()

  // Opened from a service page (?from=service): go back there after saving
  const fromService = from === "service" && faq.serviceId !== null
  const returnTo = fromService ? `/admin/services/${faq.serviceId}` : "/admin/faqs"

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit FAQ"
        description={faq.serviceName ?? "General (Home Page)"}
        actions={[
          {
            label: fromService ? "Back to Service" : "Back to FAQs",
            href: returnTo,
            variant: "outline",
          },
        ]}
      />
      <div className="max-w-2xl mx-auto">
        <FaqForm
          mode="edit"
          services={services.map((s) => ({ id: s.id, name: s.name }))}
          initialData={faq}
          returnTo={returnTo}
        />
      </div>
    </div>
  )
}
