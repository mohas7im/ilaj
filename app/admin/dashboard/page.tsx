import { PageHeader } from "@/components/admin/PageHeader"
import { DashboardClientView } from "./_components/DashboardClientView"
import { getDashboardStats } from "@/server/services/dashboard.service"
import { getInquiries } from "@/server/services/inquiry.service"
import type {
  DashboardStats,
  DashboardInquiry,
} from "./_types/dashboard.types"

export const dynamic = "force-dynamic"
export const metadata = { title: "Dashboard | Admin" }

export default async function DashboardPage() {
  let initialStats: DashboardStats | null = null
  let initialInquiries: DashboardInquiry[] = []

  try {
    const [stats, inqData] = await Promise.all([
      getDashboardStats(),
      getInquiries({ pageNumber: 1, pageSize: 5 }),
    ])
    initialStats = stats
    initialInquiries = (inqData.inquiries || []) as DashboardInquiry[]
  } catch (error) {
    console.error("Error loading dashboard server data:", error)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of your clinic website activity, inquiries, and statistics."
      />
      <DashboardClientView
        initialStats={initialStats}
        initialInquiries={initialInquiries}
      />
    </div>
  )
}
