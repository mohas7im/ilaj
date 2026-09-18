"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { authService } from "@/services/auth.service"
import {
  LogOut,
  ChevronsUpDown,
  CircleUser,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronRight,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { ADMIN_BRANDING, NAV_GROUPS, MOCK_USER, type NavItem } from "@/lib/admin/config"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/admin/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/admin/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/admin/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/admin/ui/avatar"

// ─── Nav Item ────────────────────────────────────────────────────────────────

function NavMenuItem({ item }: { item: NavItem }) {
  const pathname = usePathname()
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  const hasSubItems = Boolean(item.items && item.items.length > 0)
  const isAnyChildActive = Boolean(
    item.items?.some(
      (sub) => pathname === sub.href || pathname.startsWith(sub.href)
    )
  )
  const [open, setOpen] = useState(isAnyChildActive)

  useEffect(() => {
    if (isAnyChildActive) {
      setOpen(true)
    }
  }, [isAnyChildActive])

  if (hasSubItems) {
    if (isCollapsed) {
      return (
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <SidebarMenuButton
                  tooltip={item.title}
                  isActive={isAnyChildActive}
                >
                  <item.icon />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              }
            />
            <DropdownMenuContent side="right" align="start" className="min-w-44">
              <DropdownMenuLabel>{item.title}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {item.items!.map((subItem) => {
                const isSubActive =
                  pathname === subItem.href || pathname.startsWith(subItem.href)
                return (
                  <DropdownMenuItem
                    key={subItem.href}
                    render={<Link href={subItem.href} />}
                    className={cn(
                      isSubActive &&
                        "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    )}
                  >
                    {subItem.title}
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      )
    }

    return (
      <SidebarMenuItem>
        <Collapsible open={open} onOpenChange={setOpen} className="w-full">
          <CollapsibleTrigger
            render={
              <SidebarMenuButton
                tooltip={item.title}
                isActive={isAnyChildActive}
              >
                <item.icon />
                <span>{item.title}</span>
                <ChevronRight
                  className={cn(
                    "ml-auto size-4 transition-transform duration-200",
                    open && "rotate-90"
                  )}
                />
              </SidebarMenuButton>
            }
          />
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.items!.map((subItem) => {
                const isSubActive =
                  pathname === subItem.href || pathname.startsWith(subItem.href)
                return (
                  <SidebarMenuSubItem key={subItem.href}>
                    <SidebarMenuSubButton
                      render={<Link href={subItem.href} />}
                      isActive={isSubActive}
                    >
                      <span>{subItem.title}</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                )
              })}
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      </SidebarMenuItem>
    )
  }

  if (!item.href) return null

  const isActive =
    item.href === "/admin" || item.href === "/admin/dashboard"
      ? pathname === "/admin" || pathname === "/admin/dashboard"
      : pathname.startsWith(item.href)

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        render={<Link href={item.href} />}
        isActive={isActive}
        tooltip={item.title}
      >
        <item.icon />
        <span>{item.title}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

// ─── Admin Sidebar ────────────────────────────────────────────────────────────

export function AdminSidebar() {
  const router = useRouter()
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"
  const [currentUser, setCurrentUser] = useState(MOCK_USER)

  useEffect(() => {
    authService.me().then((u) => {
      if (u) {
        setCurrentUser({ name: u.name, email: u.email })
      }
    })
  }, [])

  const handleLogout = async () => {
    try {
      await authService.logout()
    } finally {
      router.push("/admin/login")
      router.refresh()
    }
  }

  const initials = currentUser.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <Sidebar collapsible="icon">
      {/* ── Header ── */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div
              className={cn(
                "flex items-center gap-2 px-1 py-1.5",
                isCollapsed && "justify-center"
              )}
            >
              {/* Logo mark — always visible */}
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold select-none">
                {ADMIN_BRANDING.shortName}
              </div>

              {/* Brand name + toggle — only when expanded */}
              {!isCollapsed && (
                <>
                  <div className="flex flex-col leading-tight overflow-hidden flex-1 min-w-0">
                    <span className="truncate text-sm font-semibold">
                      {ADMIN_BRANDING.name}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {ADMIN_BRANDING.description}
                    </span>
                  </div>
                  {/* Collapse button — inside sidebar header */}
                  <SidebarTrigger
                    className="ml-auto h-7 w-7 shrink-0 text-muted-foreground hover:text-foreground"
                    aria-label="Collapse sidebar"
                  >
                    <PanelLeftClose className="h-4 w-4" />
                  </SidebarTrigger>
                </>
              )}

              {/* Expand button — shown as a tooltip icon when collapsed */}
              {isCollapsed && (
                <SidebarTrigger
                  className="h-7 w-7 shrink-0 text-muted-foreground hover:text-foreground"
                  aria-label="Expand sidebar"
                >
                  <PanelLeftOpen className="h-4 w-4" />
                </SidebarTrigger>
              )}
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* ── Navigation ── */}
      <SidebarContent>
        {NAV_GROUPS.map((group, groupIndex) => (
          <SidebarGroup key={groupIndex}>
            {group.label && (
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            )}
            <SidebarMenu>
              {group.items.map((item) => (
                <NavMenuItem key={item.href ?? item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* ── Footer / User ── */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    tooltip={currentUser.name}
                  >
                    <Avatar className="h-7 w-7 rounded-lg">
                      <AvatarFallback className="rounded-lg text-xs">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col leading-tight">
                      <span className="text-sm font-medium">{currentUser.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {currentUser.email}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                }
              />
              <DropdownMenuContent
                side="top"
                align="start"
                className="w-56"
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarFallback className="rounded-lg text-xs">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col leading-tight">
                      <span className="font-medium">{currentUser.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {currentUser.email}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <CircleUser className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      {/* SidebarRail removed — toggle is now the button in the header */}
    </Sidebar>
  )
}
