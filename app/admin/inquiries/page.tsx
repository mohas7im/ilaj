"use client"

import { useState } from "react"
import { PageHeader } from "@/components/admin/PageHeader"
import { InquiryFilters, type InquiryFilterState } from "./_components/InquiryFilters"
import { InquiryTable } from "./_components/InquiryTable"
import { MOCK_INQUIRIES } from "./_services/inquiry.service"

export default function InquiriesPage() {
  const [filters, setFilters] = useState<InquiryFilterState>({
    search: "",
    treatment: "all",
    dateFrom: undefined,
    dateTo: undefined,
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inquiries"
        description="Review and manage inquiries received from your website."
      />

      <InquiryFilters filters={filters} onFiltersChange={setFilters} />
      <InquiryTable inquiries={MOCK_INQUIRIES} filters={filters} />
    </div>
  )
}
