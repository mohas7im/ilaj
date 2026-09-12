import { PageHeader } from "@/components/admin/PageHeader"
import { WhyChooseUsEditor } from "./_components/WhyChooseUsEditor"
import { INITIAL_WHY_CHOOSE_US } from "./_services/why-choose-us.service"

export const metadata = { title: "Why Choose Us" }

export default function WhyChooseUsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Why Choose Us"
        description="Manage the clinic's differentiators, numbered highlights, and promotional showcase."
      />

      <WhyChooseUsEditor initialData={INITIAL_WHY_CHOOSE_US} />
    </div>
  )
}
