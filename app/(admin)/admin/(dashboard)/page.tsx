import { PageHeader } from "@/components/admin/common/PageHeader"
import { DashboardSection } from "@/components/admin/dashboard/DashboardSection"
import { StatsCard } from "@/components/admin/dashboard/StatsCard"
import { RecentAppointments } from "@/components/admin/dashboard/RecentAppointments"

import {
  MOCK_STATS,
  MOCK_APPOINTMENTS,
} from "@/features/admin/dashboard/data"

// ─── Dashboard Page ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <PageHeader
        title="Dashboard"
        description="Overview of your clinic's activity and performance."
      />

      {/* Stat cards */}
      <DashboardSection>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MOCK_STATS.map((stat) => (
            <StatsCard key={stat.title} {...stat} />
          ))}
        </div>
      </DashboardSection>

      {/* Recent appointments table */}
      <RecentAppointments appointments={MOCK_APPOINTMENTS} />
    </div>
  )
}
