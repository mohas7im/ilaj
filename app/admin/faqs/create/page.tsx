import { PageHeader } from "@/components/admin/PageHeader"
import { getServices } from "@/server/services/service.service"
import { FaqForm } from "../_components/FaqForm"

export const dynamic = "force-dynamic"
export const metadata = { title: "Add FAQ" }

type Props = { searchParams: Promise<{ serviceId?: string }> }

export default async function CreateFaqPage({ searchParams }: Props) {
  const [{ serviceId }, services] = await Promise.all([searchParams, getServices()])
  const serviceOptions = services.map((s) => ({ id: s.id, name: s.name }))

  // Coming from a service page: pre-select it and go back there after saving
  const fromService = serviceOptions.find((s) => s.id === serviceId)
  const returnTo = fromService ? `/admin/services/${fromService.id}` : "/admin/faqs"

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add FAQ"
        description={
          fromService
            ? `New question for ${fromService.name}.`
            : "Add a question and answer for a treatment or the home page."
        }
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
          mode="create"
          services={serviceOptions}
          defaultServiceId={fromService?.id}
          returnTo={returnTo}
        />
      </div>
    </div>
  )
}
