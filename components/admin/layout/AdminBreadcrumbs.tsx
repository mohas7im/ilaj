"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/admin/ui/breadcrumb"

// ─── Route label map ──────────────────────────────────────────────────────────
// Add or override segment labels here.
const SEGMENT_LABELS: Record<string, string> = {
  admin: "Dashboard",
  appointments: "Appointments",
  patients: "Patients",
  doctors: "Doctors",
  services: "Services",
  inquiries: "Inquiries",
  users: "Users",
  settings: "Settings",
  new: "New",
  edit: "Edit",
}

function formatSegment(segment: string): string {
  // Check the label map first
  if (SEGMENT_LABELS[segment]) return SEGMENT_LABELS[segment]
  // Dynamic segments (IDs) → capitalise first letter
  return segment.charAt(0).toUpperCase() + segment.slice(1)
}

// ─── AdminBreadcrumbs ─────────────────────────────────────────────────────────

export function AdminBreadcrumbs() {
  const pathname = usePathname()

  // Split path and remove empty segments
  const segments = pathname.split("/").filter(Boolean)

  // Build cumulative hrefs: /admin, /admin/patients, /admin/patients/123 …
  const crumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/")
    const label = formatSegment(segment)
    return { href, label }
  })

  // Always show "Dashboard" as first crumb; skip if already the only crumb
  if (crumbs.length === 0) return null

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1

          return (
            <span key={crumb.href} className="flex items-center gap-1.5">
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink render={<Link href={crumb.href} />}>
                    {crumb.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </span>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
