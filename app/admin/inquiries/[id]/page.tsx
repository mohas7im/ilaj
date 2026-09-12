import { notFound } from "next/navigation"
import { PageHeader } from "@/components/admin/PageHeader"
import { InquiryDetails } from "../_components/InquiryDetails"
import { getInquiryById } from "../_services/inquiry.service"

type Props = { params: Promise<{ id: string }> }

export const metadata = { title: "Inquiry Details" }

export default async function InquiryDetailPage({ params }: Props) {
  const { id } = await params
  const inquiry = await getInquiryById(id)
  if (!inquiry) notFound()

  const displayName = inquiry.fullName || inquiry.name || "Inquiry"
  const treatment = inquiry.treatment || inquiry.subject || "Appointment Request"

  return (
    <div className="space-y-5">
      <PageHeader
        title={`Inquiry — ${displayName}`}
        description={`Treatment: ${treatment}`}
      />
      <div className="max-w-3xl">
        <InquiryDetails inquiry={inquiry} />
      </div>
    </div>
  )
}
