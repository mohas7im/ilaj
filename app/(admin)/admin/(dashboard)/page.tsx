import {
  CalendarDays,
  Users,
  Stethoscope,
  MessageSquare,
  CalendarPlus,
  UserPlus,
} from "lucide-react"

import { StatsCard } from "@/components/admin/dashboard/StatsCard"
import { RecentActivity, type ActivityItem } from "@/components/admin/dashboard/RecentActivity"
import { QuickActions, type QuickAction } from "@/components/admin/dashboard/QuickActions"
import { DashboardSection } from "@/components/admin/dashboard/DashboardSection"

// ─── Mock data ────────────────────────────────────────────────────────────────

const STATS = [
  {
    title: "Total Appointments",
    value: "248",
    icon: CalendarDays,
    trend: { value: 12, label: "from last month" },
  },
  {
    title: "Patients",
    value: "1,892",
    icon: Users,
    trend: { value: 8, label: "from last month" },
  },
  {
    title: "Doctors",
    value: "14",
    icon: Stethoscope,
    description: "Active practitioners",
  },
  {
    title: "Pending Inquiries",
    value: "37",
    icon: MessageSquare,
    trend: { value: -5, label: "from last week" },
  },
]

const ACTIVITY: ActivityItem[] = [
  {
    id: "1",
    type: "appointment",
    title: "New appointment booked",
    description: "Sara Ahmed — General Checkup, Dr. Khan",
    time: "2m ago",
    status: "confirmed",
  },
  {
    id: "2",
    type: "patient",
    title: "New patient registered",
    description: "Omar Farooq — Walk-in registration",
    time: "14m ago",
    status: "pending",
  },
  {
    id: "3",
    type: "inquiry",
    title: "New inquiry received",
    description: "Question about dental implant pricing",
    time: "1h ago",
    status: "pending",
  },
  {
    id: "4",
    type: "appointment",
    title: "Appointment completed",
    description: "Aisha Malik — Teeth Cleaning, Dr. Raza",
    time: "2h ago",
    status: "completed",
  },
  {
    id: "5",
    type: "appointment",
    title: "Appointment cancelled",
    description: "Tariq Hussain — Root Canal, Dr. Noor",
    time: "3h ago",
    status: "cancelled",
  },
]

const QUICK_ACTIONS: QuickAction[] = [
  {
    label: "New Appointment",
    href: "/admin/appointments/new",
    icon: CalendarPlus,
  },
  {
    label: "Add Patient",
    href: "/admin/patients/new",
    icon: UserPlus,
  },
  {
    label: "View Inquiries",
    href: "/admin/inquiries",
    icon: MessageSquare,
  },
  {
    label: "Manage Doctors",
    href: "/admin/doctors",
    icon: Stethoscope,
  },
]

// ─── Dashboard Page ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back. Here&apos;s what&apos;s happening today.
        </p>
      </div>

      {/* Stats */}
      <DashboardSection>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat) => (
            <StatsCard key={stat.title} {...stat} />
          ))}
        </div>
      </DashboardSection>

      {/* Activity + Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <RecentActivity items={ACTIVITY} />
        </div>
        <div>
          <QuickActions actions={QUICK_ACTIONS} />
        </div>
      </div>
    </div>
  )
}
