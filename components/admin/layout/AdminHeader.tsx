"use client"

import * as React from "react"
import Link from "next/link"
import { Globe } from "lucide-react"
import { SidebarTrigger } from "@/components/admin/ui/sidebar"
import { Separator } from "@/components/admin/ui/separator"
import { Button } from "@/components/admin/ui/button"
import { AdminBreadcrumb } from "./AdminBreadcrumb"

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between border-b bg-background/95 px-4 backdrop-blur transition-[width,height] ease-linear">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <AdminBreadcrumb />
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground hover:text-foreground h-8 gap-1.5 px-2.5"
          render={<Link href="/" target="_blank" rel="noopener noreferrer" />}
        >
          <Globe className="h-3.5 w-3.5" />
          <span className="hidden sm:inline font-medium">View Website</span>
        </Button>
      </div>
    </header>
  )
}
