"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogOut, ChevronsUpDown, CircleUser } from "lucide-react"

import { cn } from "@/lib/utils"
import { APP_CONFIG, NAV_GROUPS, MOCK_USER, type NavItem } from "@/lib/admin/config"
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
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "@/components/admin/ui/sidebar"
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
  const isActive =
    item.href === "/admin"
      ? pathname === "/admin"
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
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  const initials = MOCK_USER.name
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
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
                {APP_CONFIG.shortName.slice(0, 1)}
              </div>
              {!isCollapsed && (
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-semibold">
                    {APP_CONFIG.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {APP_CONFIG.description}
                  </span>
                </div>
              )}
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      {/* ── Navigation ── */}
      <SidebarContent>
        {NAV_GROUPS.map((group, groupIndex) => (
          <SidebarGroup key={groupIndex}>
            {group.label && (
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            )}
            <SidebarMenu>
              {group.items.map((item) => (
                <NavMenuItem key={item.href} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* ── Footer / User ── */}
      <SidebarFooter>
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    tooltip={MOCK_USER.name}
                  >
                    <Avatar className="h-7 w-7 rounded-lg">
                      <AvatarFallback className="rounded-lg text-xs">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col leading-tight">
                      <span className="text-sm font-medium">{MOCK_USER.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {MOCK_USER.role}
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
                      <span className="font-medium">{MOCK_USER.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {MOCK_USER.email}
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
                <DropdownMenuItem className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
