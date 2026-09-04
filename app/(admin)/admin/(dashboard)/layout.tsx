import "@/styles/admin/theme.css"
import { SidebarProvider, SidebarInset } from "@/components/admin/ui/sidebar"
import { AdminSidebar } from "@/components/admin/layout/AdminSidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div data-admin-theme className="contents">
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>

          {/* Page content */}
          <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
