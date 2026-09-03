"use client"

import { useState } from "react"
import { PageHeader } from "@/components/admin/common/PageHeader"
import { InquiryFilters, type InquiryFilterState } from "@/features/admin/inquiries/components/InquiryFilters"
import { InquiryTable } from "@/features/admin/inquiries/components/InquiryTable"
import { MOCK_INQUIRIES } from "@/features/admin/inquiries/config"

export default function InquiriesPage() {
  const [filters, setFilters] = useState<InquiryFilterState>({
    search: "",
    status: "all",
  })

  return (
    <div className="space-y-5">
      <PageHeader
        title="Inquiries"
        description="View and manage incoming contact inquiries."
      />

      <InquiryFilters filters={filters} onFiltersChange={setFilters} />
      <InquiryTable inquiries={MOCK_INQUIRIES} filters={filters} />
    </div>
  )
}
