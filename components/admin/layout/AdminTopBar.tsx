"use client"

import { SidebarTrigger } from "@/components/admin/ui/sidebar"
import { Separator } from "@/components/admin/ui/separator"
import { usePathname } from "next/navigation"
import { NAV_GROUPS } from "@/lib/admin/config"

// ─── Derive page title from the current path ──────────────────────────────────

function usePageTitle(): string {
  const pathname = usePathname()
  for (const group of NAV_GROUPS) {
    for (const item of group.items) {
      if (item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href)) {
        return item.title
      }
    }
  }
  return "Admin"
}

// ─── AdminTopBar ──────────────────────────────────────────────────────────────

export function AdminTopBar() {
  const title = usePageTitle()

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b bg-background px-4">
      {/* Collapse/expand toggle */}
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-1 h-4" />
      {/* Current page title */}
      <span className="text-sm font-medium">{title}</span>
    </header>
  )
}
