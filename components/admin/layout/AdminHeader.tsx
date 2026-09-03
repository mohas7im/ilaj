"use client"

import { Bell, LogOut, CircleUser, Settings } from "lucide-react"

import { MOCK_USER } from "@/lib/admin/config"
import { Button } from "@/components/admin/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/admin/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/admin/ui/avatar"
import { Separator } from "@/components/admin/ui/separator"
import { SidebarTrigger } from "@/components/admin/ui/sidebar"
import { AdminBreadcrumbs } from "./AdminBreadcrumbs"

// ─── Admin Header ─────────────────────────────────────────────────────────────

export function AdminHeader() {
  const initials = MOCK_USER.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
      {/* Left: sidebar trigger + breadcrumbs */}
      <div className="flex flex-1 items-center gap-2 overflow-hidden">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="h-4" />
        <AdminBreadcrumbs />
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative h-8 w-8">
          <Bell className="h-4 w-4" />
          {/* Unread badge — wire to real data later */}
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-destructive" />
          <span className="sr-only">Notifications</span>
        </Button>

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                </Avatar>
                <span className="sr-only">User menu</span>
              </button>
            }
          />
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{MOCK_USER.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {MOCK_USER.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <CircleUser className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
