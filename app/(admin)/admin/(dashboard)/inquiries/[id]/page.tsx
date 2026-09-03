import { notFound } from "next/navigation"
import { PageHeader } from "@/components/admin/common/PageHeader"
import { InquiryDetails } from "@/features/admin/inquiries/components/InquiryDetails"
import { MOCK_INQUIRIES } from "@/features/admin/inquiries/config"

type Props = { params: Promise<{ id: string }> }

export default async function InquiryDetailPage({ params }: Props) {
  const { id } = await params
  const inquiry = MOCK_INQUIRIES.find((i) => i.id === id)
  if (!inquiry) notFound()

  return (
    <div className="space-y-5">
      <PageHeader
        title={`Inquiry — ${inquiry.name}`}
        description={inquiry.subject}
        actions={[{ label: "Back", href: "/admin/inquiries", variant: "outline" }]}
      />
      <div className="max-w-2xl">
        <InquiryDetails inquiry={inquiry} />
      </div>
    </div>
  )
}
