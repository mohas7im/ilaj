import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { InquiryDetails } from "../_components/InquiryDetails";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ id: string }> };

export const metadata = { title: "View Enquiry" };

export default async function InquiryDetailPage({ params }: Props) {
  const { id } = await params;
  const rawInquiry = await prisma.inquiry.findUnique({
    where: { id },
  });

  if (!rawInquiry) notFound();

  const inquiry = {
    ...rawInquiry,
    createdAt: rawInquiry.createdAt.toISOString(),
    updatedAt: rawInquiry.updatedAt.toISOString(),
  };

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
  );
}
