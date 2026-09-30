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
import { BRAND_LOGO } from "@/lib/brand"

// ============================================================
//  ADMIN CONFIG  —  lib/admin/config.ts
// ============================================================
//
//  HOW TO REBRAND FOR A NEW CLIENT:
//  1. Set the clinic name in Admin → Settings (shown in the sidebar and login)
//  2. Change ADMIN_BRANDING below (description, logo)
//  3. Change brand colors in styles/admin/theme.css
//  4. Replace the logo files in public/brand/ (see lib/brand.ts)
//
//  Do NOT edit AdminSidebar or any other
//  layout/dashboard component just to change client branding.
// ============================================================

// ─── Branding Configuration ───────────────────────────────────────────────────
// Edit this block to rebrand the admin panel for a new clinic / doctor.
// Logo images live in public/brand/ (see lib/brand.ts), shared with the website.

export const ADMIN_BRANDING = {
  /** Practice category shown under the logo on the login pages */
  description: "Dental Practice Management",
  /** Full logo — shown when sidebar is expanded and in the mobile menu */
  logo: BRAND_LOGO.full,
  /** Full logo with white text — shown over the login photo */
  logoLight: BRAND_LOGO.light,
  /** Compact logo mark — shown when sidebar is collapsed */
  logoMark: BRAND_LOGO.mark,
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
