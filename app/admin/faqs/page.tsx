import { PageHeader } from "@/components/admin/PageHeader"
import { getFaqs } from "@/server/services/faq.service"
import { getServices } from "@/server/services/service.service"
import { FaqsClientView } from "./_components/FaqsClientView"

export const dynamic = "force-dynamic"
export const metadata = {
  title: "FAQs | Admin",
}

type Props = { searchParams: Promise<{ service?: string }> }

export default async function FaqsPage({ searchParams }: Props) {
  const [{ service }, faqs, services] = await Promise.all([searchParams, getFaqs(), getServices()])
  const serviceOptions = services.map((s) => ({ id: s.id, name: s.name }))

  // ?service=<id> or ?service=general pre-selects the treatment filter
  const initialTreatment =
    service && (service === "general" || serviceOptions.some((s) => s.id === service))
      ? service
      : "all"

  return (
    <div className="space-y-6">
      <PageHeader
        title="FAQs"
        description="Questions and answers shown on the home page (General) and on each treatment page."
        actions={[
          {
            label: "+ Add FAQ",
            href: "/admin/faqs/create",
          },
        ]}
      />
      <FaqsClientView
        initialFaqs={faqs}
        services={serviceOptions}
        initialTreatment={initialTreatment}
      />
    </div>
  )
}
