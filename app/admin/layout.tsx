"use client"

import { usePathname } from "next/navigation"
import "@/styles/admin/theme.css"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/admin/ui/sidebar"
import { AdminSidebar } from "@/components/admin/AdminSidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLoginPage = pathname === "/admin/login" || pathname?.startsWith("/admin/login")

  if (isLoginPage) {
    return <div data-admin-theme className="contents">{children}</div>
  }

  return (
    <div data-admin-theme className="contents">
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>
          {/* Mobile-only menu toggle */}
          <div className="flex items-center px-4 pt-3 md:hidden">
            <SidebarTrigger />
          </div>
          <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
