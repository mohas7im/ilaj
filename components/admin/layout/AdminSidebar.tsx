"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { authService, type AuthUser } from "@/lib/auth/auth.api"
import {
  LogOut,
  ChevronsUpDown,
  CircleUser,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronRight,
  Loader2,
  KeyRound,
} from "lucide-react"
import { toast } from "sonner"
import { ChangePasswordDialog } from "./ChangePasswordDialog"

import { cn } from "@/lib/utils"
import { ADMIN_BRANDING, NAV_GROUPS, type NavItem } from "@/lib/admin/config"
import { useAdminBranding } from "./AdminBranding"
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
  const branding = useAdminBranding()
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)

  useEffect(() => {
    authService.me().then((u) => {
      if (u) {
        setCurrentUser(u)
      }
    })
  }, [])

  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    if (loggingOut) return
    setLoggingOut(true)
    try {
      await authService.logout()
      toast.success("Logged out successfully")
    } catch {
      toast.error("Failed to log out")
    } finally {
      router.push("/admin/login")
      router.refresh()
    }
  }

  const userEmail = currentUser?.email || ""
  const initials = userEmail ? userEmail.slice(0, 2).toUpperCase() : "AD"

  return (
    <Sidebar collapsible="icon">
      {/* ── Header ── */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div
              className={cn(
                "flex items-center gap-2 py-1.5",
                isCollapsed ? "flex-col justify-center" : "relative px-1"
              )}
            >
              {/* Logo mark — only when collapsed */}
              {isCollapsed && (
                <img
                  src={ADMIN_BRANDING.logoMark}
                  alt={branding.name}
                  className="h-8 w-8 shrink-0 rounded-lg select-none"
                />
              )}

              {/* Full logo + toggle — only when expanded */}
              {!isCollapsed && (
                <>
                  {/* Side padding reserves room for the absolutely positioned
                      collapse button, so the logo stays centered */}
                  <div className="flex flex-1 min-w-0 justify-center px-8">
                    <img
                      src={ADMIN_BRANDING.logo}
                      alt={branding.name}
                      className="h-10 w-auto max-w-full select-none"
                    />
                  </div>
                  {/* Collapse button — inside sidebar header */}
                  <div className="absolute inset-y-0 right-1 flex items-center">
                    <SidebarTrigger
                      className="h-7 w-7 shrink-0 text-muted-foreground hover:text-foreground"
                      aria-label="Collapse sidebar"
                    >
                      <PanelLeftClose className="h-4 w-4" />
                    </SidebarTrigger>
                  </div>
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
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg p-2 text-left text-sm outline-none transition-colors",
                  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  "focus-visible:ring-2 focus-visible:ring-sidebar-ring cursor-pointer select-none",
                  isCollapsed ? "justify-center h-9" : "h-12"
                )}
              >
                <Avatar className="h-7 w-7 rounded-lg shrink-0">
                  <AvatarFallback className="rounded-lg text-xs font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                {!isCollapsed && (
                  <>
                    <div className="flex flex-col leading-tight min-w-0 flex-1 overflow-hidden text-left">
                      <span className="text-xs font-medium truncate">{userEmail || "Admin"}</span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4 shrink-0 text-muted-foreground" />
                  </>
                )}
              </DropdownMenuTrigger>

              <DropdownMenuContent
                side={isCollapsed ? "right" : "top"}
                align="start"
                sideOffset={8}
                className="w-56 p-1.5 shadow-lg border border-border bg-popover"
              >
                <DropdownMenuLabel className="p-1.5 font-normal">
                  <div className="flex items-center gap-2.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg shrink-0">
                      <AvatarFallback className="rounded-lg text-xs font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col leading-tight overflow-hidden min-w-0">
                      <span className="font-semibold text-xs truncate">{userEmail || "Admin"}</span>
                      <span className="text-[11px] text-muted-foreground">Admin Account</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="my-1" />

                <DropdownMenuItem
                  onClick={() => setShowPasswordDialog(true)}
                  className="cursor-pointer flex items-center gap-2 px-2 py-1.5 text-xs font-medium rounded-md hover:bg-accent"
                >
                  <KeyRound className="h-4 w-4 text-muted-foreground" />
                  <span>Change Password</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="my-1" />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive cursor-pointer flex items-center gap-2 px-2 py-1.5 text-xs font-medium rounded-md hover:bg-destructive/10"
                >
                  {loggingOut ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <LogOut className="h-4 w-4" />
                  )}
                  <span>{loggingOut ? "Signing out..." : "Log out"}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      {/* Change Password Dialog Modal */}
      <ChangePasswordDialog
        open={showPasswordDialog}
        onOpenChange={setShowPasswordDialog}
      />
    </Sidebar>
  )
}
