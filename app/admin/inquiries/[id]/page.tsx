import { notFound } from "next/navigation"
import { PageHeader } from "@/components/admin/PageHeader"
import { InquiryDetails } from "../_components/InquiryDetails"
import { getInquiryById } from "../_services/inquiry.service"

type Props = { params: Promise<{ id: string }> }

export const metadata = { title: "View Enquiry" }

export default async function InquiryDetailPage({ params }: Props) {
  const { id } = await params
  const inquiry = await getInquiryById(id)
  if (!inquiry) notFound()

  return (
    <div className="space-y-6">
      <PageHeader
        title="View Enquiry"
        description="Review patient consultation and treatment request details."
        actions={[
          { label: "Back to Inquiries", href: "/admin/inquiries", variant: "outline" },
        ]}
      />
      <div className="max-w-2xl w-full mx-auto">
        <InquiryDetails inquiry={inquiry} />
      </div>
    </div>
  )
}
