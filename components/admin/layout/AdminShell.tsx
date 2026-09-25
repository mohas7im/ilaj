"use client"

import { usePathname } from "next/navigation"
import { SidebarProvider, SidebarInset } from "@/components/admin/ui/sidebar"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { AdminHeader } from "@/components/admin/layout/AdminHeader"
import { Toaster } from "@/components/admin/ui/sonner"

// Client-side admin chrome (sidebar, header, toaster). The theme attribute,
// fonts and stylesheet are set by the admin root layout (app/admin/layout.tsx).
export function AdminShell({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLoginPage = pathname === "/admin/login" || pathname?.startsWith("/admin/login")

  if (isLoginPage) {
    return (
      <>
        <Toaster />
        {children}
      </>
    )
  }

  return (
    <>
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
    </>
  )
}
