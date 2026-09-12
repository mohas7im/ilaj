import { PageHeader } from "@/components/admin/PageHeader"
import { DashboardSection } from "./_components/DashboardSection"
import { StatsCard } from "./_components/StatsCard"
import { RecentInquiries } from "./_components/RecentInquiries"
import {
  MOCK_STATS,
  MOCK_RECENT_INQUIRIES,
} from "./_services/dashboard.service"

export const metadata = { title: "Dashboard" }

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <PageHeader
        title="Dashboard"
        description="Overview of your clinic website activity and performance."
      />

      {/* Stat cards */}
      <DashboardSection>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MOCK_STATS.map((stat) => (
            <StatsCard key={stat.title} {...stat} />
          ))}
        </div>
      </DashboardSection>

      {/* Main dashboard content */}
      <RecentInquiries inquiries={MOCK_RECENT_INQUIRIES} />
    </div>
  )
}
