import Link from "next/link"
import { CalendarPlus, UserPlus, Stethoscope, Briefcase } from "lucide-react"

import { PageHeader } from "@/components/admin/common/PageHeader"
import { DashboardSection } from "@/components/admin/dashboard/DashboardSection"
import { StatsCard } from "@/components/admin/dashboard/StatsCard"
import { AppointmentOverview } from "@/components/admin/dashboard/AppointmentOverview"
import { RecentAppointments } from "@/components/admin/dashboard/RecentAppointments"
import { RecentActivity } from "@/components/admin/dashboard/RecentActivity"
import { QuickActions, type QuickAction } from "@/components/admin/dashboard/QuickActions"

import {
  MOCK_STATS,
  MOCK_APPOINTMENTS,
  MOCK_ACTIVITY,
  MOCK_CHART_DATA,
} from "@/features/admin/dashboard/data"

// ─── Quick action definitions ──────────────────────────────────────────────────

const QUICK_ACTIONS: QuickAction[] = [
  { label: "New Appointment", href: "/admin/appointments/new", icon: CalendarPlus },
  { label: "Add Patient",     href: "/admin/patients/new",     icon: UserPlus },
  { label: "Add Doctor",      href: "/admin/doctors/new",      icon: Stethoscope },
  { label: "Add Service",     href: "/admin/services/new",     icon: Briefcase },
]

// ─── Dashboard Page ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <PageHeader
        title="Dashboard"
        description="Overview of your clinic's activity and performance."
        actions={[
          {
            label: "+ New Appointment",
            href: "/admin/appointments/new",
          },
        ]}
      />

      {/* Stat cards */}
      <DashboardSection>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MOCK_STATS.map((stat) => (
            <StatsCard key={stat.title} {...stat} />
          ))}
        </div>
      </DashboardSection>

      {/* Appointment overview chart */}
      <AppointmentOverview data={MOCK_CHART_DATA} />

      {/* Recent appointments table */}
      <RecentAppointments appointments={MOCK_APPOINTMENTS} />

      {/* Activity feed + Quick actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <RecentActivity items={MOCK_ACTIVITY} />
        </div>
        <div>
          <QuickActions actions={QUICK_ACTIONS} />
        </div>
      </div>
    </div>
  )
}
