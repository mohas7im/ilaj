import {
  LayoutDashboard,
  Stethoscope,
  Briefcase,
  MessageSquare,
  UserCog,
  Settings,
  Star,
  LineChart,
  Images,
  Sparkles,
  Search,
  MessageCircleQuestionMark,
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
//  Do NOT edit AdminSidebar or any other
//  layout/dashboard component just to change client branding.
// ============================================================

// ─── Branding Configuration ───────────────────────────────────────────────────
// Edit this block to rebrand the admin panel for a new clinic / doctor.
// Logo images: place SVG files in public/admin/ and update paths below.

export const ADMIN_BRANDING = {
  /** Full clinic / practice name */
  name: "Ilaj Dental Clinic",
  /** Short abbreviation used when the sidebar is collapsed */
  shortName: "ID",
  /** Practice category shown under the name in the sidebar header */
  description: "Dental Practice Management",
  /** Path to full logo image — shown when sidebar is expanded */
  logo: "/admin/logo.svg",
  /** Path to compact logo mark — shown when sidebar is collapsed */
  logoMark: "/admin/logo-mark.svg",
  /** Favicon path */
  favicon: "/admin/favicon.ico",
}

// ─── Navigation ───────────────────────────────────────────────────────────────

export type NavSubItem = {
  title: string
  href: string
  icon?: LucideIcon
}

export type NavItem = {
  title: string
  href?: string
  icon: LucideIcon
  /** Optional badge count shown in sidebar (e.g. pending items) */
  badge?: number
  /** Sub-navigation items for dropdown/collapsible menus */
  items?: NavSubItem[]
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
        href: "/admin/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "Management",
    items: [
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
        title: "Gallery",
        icon: Images,
        items: [
          {
            title: "Clinic Gallery",
            href: "/admin/gallery/clinic",
          },
          {
            title: "Patient Gallery",
            href: "/admin/gallery/patient",
          },
        ],
      },
      {
        title: "Testimonials",
        href: "/admin/testimonials",
        icon: Star,
      },
      {
        title: "FAQs",
        href: "/admin/faqs",
        icon: MessageCircleQuestionMark,
      },
      {
        title: "Why Choose Us",
        href: "/admin/why-choose-us",
        icon: Sparkles,
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
        title: "SEO",
        href: "/admin/seo",
        icon: Search,
      },
      {
        title: "Settings",
        href: "/admin/settings",
        icon: Settings,
      },
    ],
  },
]

export type AdminUser = {
  name?: string | null
  email: string
  avatar?: string
}

// ─── Legacy alias (kept for backward compat with existing imports) ─────────────
/** @deprecated Use ADMIN_BRANDING instead */
export const APP_CONFIG = {
  name: ADMIN_BRANDING.name,
  shortName: ADMIN_BRANDING.shortName,
  description: ADMIN_BRANDING.description,
} as const
