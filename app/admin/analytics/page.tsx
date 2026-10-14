import { PageHeader } from "@/components/admin/PageHeader"
import { AnalyticsClientView } from "./_components/AnalyticsClientView"

export const metadata = { title: "Analytics | Admin" }

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Website visitors, popular pages and traffic sources from Google Analytics."
      />
      <AnalyticsClientView />
    </div>
  )
}
