"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, ChevronDown } from "lucide-react"

import { NAV_GROUPS, ADMIN_BRANDING, type NavItem } from "@/lib/admin/config"
import { Button } from "@/components/admin/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/admin/ui/sheet"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/admin/ui/collapsible"
import { cn } from "@/lib/utils"

// ─── Mobile Nav Item ──────────────────────────────────────────────────────────

function MobileNavItem({
  item,
  onSelect,
}: {
  item: NavItem
  onSelect: () => void
}) {
  const pathname = usePathname()
  const isAnyChildActive = Boolean(
    item.items?.some(
      (sub) => pathname === sub.href || pathname.startsWith(sub.href)
    )
  )
  const [open, setOpen] = useState(isAnyChildActive)

  if (item.items && item.items.length > 0) {
    return (
      <Collapsible open={open} onOpenChange={setOpen} className="w-full">
        <CollapsibleTrigger
          className={cn(
            "flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
            isAnyChildActive
              ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
              : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          )}
        >
          <div className="flex items-center gap-3">
            <item.icon className="h-4 w-4 shrink-0" />
            <span>{item.title}</span>
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 transition-transform duration-200",
              open && "rotate-180"
            )}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="pl-7 pt-1 space-y-1">
          {item.items.map((sub) => {
            const isSubActive =
              pathname === sub.href || pathname.startsWith(sub.href)
            return (
              <Link
                key={sub.href}
                href={sub.href}
                onClick={onSelect}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                  isSubActive
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <span>{sub.title}</span>
              </Link>
            )
          })}
        </CollapsibleContent>
      </Collapsible>
    )
  }

  if (!item.href) return null

  const isActive =
    item.href === "/admin"
      ? pathname === "/admin"
      : pathname.startsWith(item.href)

  return (
    <Link
      href={item.href}
      onClick={onSelect}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
        isActive
          ? "bg-primary text-primary-foreground font-medium"
          : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      )}
    >
      <item.icon className="h-4 w-4 shrink-0" />
      {item.title}
    </Link>
  )
}

// ─── AdminMobileNav ───────────────────────────────────────────────────────────

export function AdminMobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 md:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="border-b px-4 py-3">
            <SheetTitle className="flex items-center gap-2 text-base">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-bold select-none">
                {ADMIN_BRANDING.shortName}
              </div>
              {ADMIN_BRANDING.name}
            </SheetTitle>
          </SheetHeader>

          <nav className="flex flex-col gap-1 overflow-y-auto p-3">
            {NAV_GROUPS.map((group, groupIndex) => (
              <div key={groupIndex} className="mb-2">
                {group.label && (
                  <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {group.label}
                  </p>
                )}
                {group.items.map((item) => (
                  <MobileNavItem
                    key={item.href ?? item.title}
                    item={item}
                    onSelect={() => setOpen(false)}
                  />
                ))}
              </div>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </>
  )
}
