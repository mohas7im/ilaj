import { SidebarProvider, SidebarInset } from "@/components/admin/ui/sidebar"
import { AdminSidebar } from "@/components/admin/layout/AdminSidebar"
import { AdminHeader } from "@/components/admin/layout/AdminHeader"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <AdminHeader />
        <main className="flex flex-1 flex-col gap-4 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
