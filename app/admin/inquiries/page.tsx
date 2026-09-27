import { PageHeader } from "@/components/admin/PageHeader"
import { InquiriesClientView } from "./_components/InquiriesClientView"

export const metadata = {
  title: "Inquiries | Admin",
}

export default function InquiriesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Inquiries"
        description="Review and manage inquiries received from your website contact form."
      />
      <InquiriesClientView />
    </div>
  )
}
