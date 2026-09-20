"use client"

import { usePathname } from "next/navigation"
import "@/styles/admin/theme.css"
import { SidebarProvider, SidebarInset } from "@/components/admin/ui/sidebar"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { AdminHeader } from "@/components/admin/layout/AdminHeader"
import { Toaster } from "@/components/admin/ui/sonner"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLoginPage = pathname === "/admin/login" || pathname?.startsWith("/admin/login")

  if (isLoginPage) {
    return (
      <div data-admin-theme className="contents">
        <Toaster />
        {children}
      </div>
    )
  }

  return (
    <div data-admin-theme className="contents">
      <Toaster />
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>
          <AdminHeader />
          <main className="flex flex-1 flex-col gap-6 p-3">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
