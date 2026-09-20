"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/admin/ui/breadcrumb"

export type BreadcrumbEntry = {
  label: string
  href?: string
  isCurrent?: boolean
}

export function getBreadcrumbs(pathname: string): BreadcrumbEntry[] {
  const cleanPath = pathname.split("?")[0].replace(/\/$/, "")

  if (!cleanPath || cleanPath === "/admin" || cleanPath === "/admin/dashboard") {
    return [{ label: "Dashboard", isCurrent: true }]
  }

  const crumbs: BreadcrumbEntry[] = [
    { label: "Dashboard", href: "/admin/dashboard" },
  ]

  const segments = cleanPath.replace(/^\/admin\/?/, "").split("/").filter(Boolean)

  if (segments.length === 0) {
    return [{ label: "Dashboard", isCurrent: true }]
  }

  const first = segments[0]

  switch (first) {
    case "services": {
      if (segments.length === 1) {
        crumbs.push({ label: "Services", isCurrent: true })
      } else if (segments[1] === "create") {
        crumbs.push({ label: "Services", href: "/admin/services" })
        crumbs.push({ label: "Create Service", isCurrent: true })
      } else if (segments[2] === "edit") {
        crumbs.push({ label: "Services", href: "/admin/services" })
        crumbs.push({ label: "Edit Service", isCurrent: true })
      } else {
        crumbs.push({ label: "Services", href: "/admin/services" })
        crumbs.push({ label: "View Service", isCurrent: true })
      }
      break
    }
    case "doctors": {
      if (segments.length === 1) {
        crumbs.push({ label: "Doctors", isCurrent: true })
      } else if (segments[1] === "create") {
        crumbs.push({ label: "Doctors", href: "/admin/doctors" })
        crumbs.push({ label: "Create Doctor", isCurrent: true })
      } else if (segments[2] === "edit") {
        crumbs.push({ label: "Doctors", href: "/admin/doctors" })
        crumbs.push({ label: "Edit Doctor", isCurrent: true })
      } else {
        crumbs.push({ label: "Doctors", href: "/admin/doctors" })
        crumbs.push({ label: "View Doctor", isCurrent: true })
      }
      break
    }
    case "inquiries": {
      if (segments.length === 1) {
        crumbs.push({ label: "Inquiries", isCurrent: true })
      } else {
        crumbs.push({ label: "Inquiries", href: "/admin/inquiries" })
        crumbs.push({ label: "View Inquiry", isCurrent: true })
      }
      break
    }
    case "testimonials": {
      if (segments.length === 1) {
        crumbs.push({ label: "Testimonials", isCurrent: true })
      } else if (segments[1] === "create") {
        crumbs.push({ label: "Testimonials", href: "/admin/testimonials" })
        crumbs.push({ label: "Create Testimonial", isCurrent: true })
      } else if (segments[2] === "edit") {
        crumbs.push({ label: "Testimonials", href: "/admin/testimonials" })
        crumbs.push({ label: "Edit Testimonial", isCurrent: true })
      } else {
        crumbs.push({ label: "Testimonials", href: "/admin/testimonials" })
        crumbs.push({ label: "View Testimonial", isCurrent: true })
      }
      break
    }
    case "why-choose-us": {
      crumbs.push({ label: "Why Choose Us", isCurrent: true })
      break
    }
    case "gallery": {
      crumbs.push({ label: "Gallery", href: "/admin/gallery/clinic" })
      const sub = segments[1]
      if (sub === "clinic") {
        if (segments.length === 2) {
          crumbs.push({ label: "Clinic Gallery", isCurrent: true })
        } else if (segments[2] === "create") {
          crumbs.push({ label: "Clinic Gallery", href: "/admin/gallery/clinic" })
          crumbs.push({ label: "Add Photo", isCurrent: true })
        } else if (segments[3] === "edit") {
          crumbs.push({ label: "Clinic Gallery", href: "/admin/gallery/clinic" })
          crumbs.push({ label: "Edit Photo", isCurrent: true })
        }
      } else if (sub === "patient") {
        if (segments.length === 2) {
          crumbs.push({ label: "Patient Gallery", isCurrent: true })
        } else if (segments[2] === "create") {
          crumbs.push({ label: "Patient Gallery", href: "/admin/gallery/patient" })
          crumbs.push({ label: "Add Case", isCurrent: true })
        } else if (segments[3] === "edit") {
          crumbs.push({ label: "Patient Gallery", href: "/admin/gallery/patient" })
          crumbs.push({ label: "Edit Case", isCurrent: true })
        }
      }
      break
    }
    case "seo": {
      crumbs.push({ label: "SEO Settings", isCurrent: true })
      break
    }
    case "settings": {
      crumbs.push({ label: "Clinic Settings", isCurrent: true })
      break
    }
    case "analytics": {
      crumbs.push({ label: "Analytics", isCurrent: true })
      break
    }
    default: {
      let accumulated = "/admin"
      segments.forEach((seg, i) => {
        accumulated += `/${seg}`
        const isLast = i === segments.length - 1
        const formatted = seg
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ")
        crumbs.push({
          label: formatted,
          href: isLast ? undefined : accumulated,
          isCurrent: isLast,
        })
      })
      break
    }
  }

  return crumbs
}

export function AdminBreadcrumb() {
  const pathname = usePathname()
  const crumbs = React.useMemo(() => getBreadcrumbs(pathname), [pathname])

  return (
    <Breadcrumb className="hidden sm:block">
      <BreadcrumbList>
        {crumbs.map((crumb, idx) => (
          <React.Fragment key={crumb.label + idx}>
            {idx > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {crumb.isCurrent ? (
                <BreadcrumbPage className="font-medium text-foreground">
                  {crumb.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink render={<Link href={crumb.href || "#"} />}>
                  {crumb.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
