import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Stethoscope,
  Briefcase,
  MessageSquare,
  UserCog,
  Settings,
  type LucideIcon,
} from "lucide-react"

// ─── App Meta ────────────────────────────────────────────────────────────────

export const APP_CONFIG = {
  name: "Admin Panel",
  shortName: "Admin",
  description: "Management Dashboard",
} as const

// ─── Navigation ──────────────────────────────────────────────────────────────

export type NavItem = {
  title: string
  href: string
  icon: LucideIcon
  badge?: number
}

export type NavGroup = {
  label?: string
  items: NavItem[]
}

export const NAV_GROUPS: NavGroup[] = [
  {
    items: [
      {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "Management",
    items: [
      {
        title: "Appointments",
        href: "/admin/appointments",
        icon: CalendarDays,
      },
      {
        title: "Patients",
        href: "/admin/patients",
        icon: Users,
      },
      {
        title: "Doctors",
        href: "/admin/doctors",
        icon: Stethoscope,
      },
      {
        title: "Services",
        href: "/admin/services",
        icon: Briefcase,
      },
    ],
  },
  {
    label: "Communication",
    items: [
      {
        title: "Inquiries",
        href: "/admin/inquiries",
        icon: MessageSquare,
      },
    ],
  },
  {
    label: "System",
    items: [
      {
        title: "Users",
        href: "/admin/users",
        icon: UserCog,
      },
      {
        title: "Settings",
        href: "/admin/settings",
        icon: Settings,
      },
    ],
  },
]

// ─── Mock User ────────────────────────────────────────────────────────────────
// Replace with real auth data when authentication is implemented.

export type AdminUser = {
  name: string
  email: string
  role: string
  avatar?: string
}

export const MOCK_USER: AdminUser = {
  name: "Admin User",
  email: "admin@example.com",
  role: "Super Admin",
}
