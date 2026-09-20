import { PageHeader } from "@/components/admin/PageHeader"
import { getInquiries } from "@/server/services/inquiry.service"
import { InquiriesClientView } from "./_components/InquiriesClientView"
import type { InquiryPaginatedResponse } from "./_types/inquiry.types"

export const dynamic = "force-dynamic"
export const metadata = {
  title: "Inquiries | Admin",
}

export default async function InquiriesPage() {
  let initialData: InquiryPaginatedResponse = {
    inquiries: [],
    pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
  }

  try {
    initialData = await getInquiries({ page: 1, limit: 10 })
  } catch (error) {
    console.error("Failed to load initial inquiries:", error)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inquiries"
        description="Review and manage inquiries received from your website contact form."
      />
      <InquiriesClientView initialData={initialData} />
    </div>
  )
}
