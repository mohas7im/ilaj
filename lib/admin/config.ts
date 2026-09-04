import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Stethoscope,
  Briefcase,
  MessageSquare,
  UserCog,
  Settings,
  Star,
  LineChart,
  type LucideIcon,
} from "lucide-react"

// ============================================================
//  ADMIN CONFIG  —  lib/admin/config.ts
// ============================================================
//
//  HOW TO REBRAND FOR A NEW CLIENT:
//  1. Change ADMIN_BRANDING below (name, logo, description)
//  2. Change brand colors in styles/admin/theme.css
//  3. Replace public/admin/logo.svg + logo-mark.svg
//
//  Do NOT edit AdminSidebar, AdminHeader, or any other
//  layout/dashboard component just to change client branding.
// ============================================================

// ─── Branding ─────────────────────────────────────────────────────────────────

export type AdminBranding = {
  /** Full application name shown in sidebar header and page titles */
  name: string
  /** Short name (1-2 chars) used for the logo-mark fallback */
  shortName: string
  /** Subtitle shown under the name in the sidebar */
  description: string
  /** Path to the full logo SVG (shown when sidebar is expanded) */
  logo: string
  /** Path to the logo mark / icon SVG (shown when sidebar is collapsed) */
  logoMark: string
  /** Path to admin favicon */
  favicon: string
}

export const ADMIN_BRANDING: AdminBranding = {
  name: "Ilaj",
  shortName: "IL",
  description: "Dental Clinic Administration",
  logo: "/admin/logo.svg",
  logoMark: "/admin/logo-mark.svg",
  favicon: "/admin/favicon.ico",
}

// ─── Navigation ───────────────────────────────────────────────────────────────

export type NavItem = {
  title: string
  href: string
  icon: LucideIcon
  /** Optional badge count shown in sidebar (e.g. pending items) */
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
        title: "Doctors",
        href: "/admin/doctors",
        icon: Stethoscope,
      },
      {
        title: "Services",
        href: "/admin/services",
        icon: Briefcase,
      },
      {
        title: "Testimonials",
        href: "/admin/testimonials",
        icon: Star,
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
        title: "Analytics",
        href: "/admin/analytics",
        icon: LineChart,
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
// Replace with real auth session data when authentication is implemented.

export type AdminUser = {
  name: string
  email: string
  avatar?: string
}

export const MOCK_USER: AdminUser = {
  name: "Admin",
  email: "admin@ilaj.com",
}

// ─── Legacy alias (kept for backward compat with existing imports) ─────────────
/** @deprecated Use ADMIN_BRANDING instead */
export const APP_CONFIG = {
  name: ADMIN_BRANDING.name,
  shortName: ADMIN_BRANDING.shortName,
  description: ADMIN_BRANDING.description,
} as const
