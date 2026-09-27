import { PageHeader } from "@/components/admin/PageHeader"
import { DashboardClientView } from "./_components/DashboardClientView"

export const metadata = { title: "Dashboard | Admin" }

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of your clinic website activity, inquiries, and statistics."
      />
      <DashboardClientView />
    </div>
  )
}
