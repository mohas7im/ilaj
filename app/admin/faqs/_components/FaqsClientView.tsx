"use client"

import { useState } from "react"
import type { Faq } from "@/domain/faq/faq.types"
import { FaqFilters, type FaqFilterState } from "./FaqFilters"
import { FaqTable } from "./FaqTable"

export function FaqsClientView({ initialFaqs }: { initialFaqs: Faq[] }) {
  const [filters, setFilters] = useState<FaqFilterState>({ search: "" })

  return (
    <div className="space-y-4">
      <FaqFilters filters={filters} onFiltersChange={setFilters} />
      <FaqTable faqs={initialFaqs} filters={filters} />
    </div>
  )
}
