"use client"

import { useState } from "react"
import type { Faq } from "@/domain/faq/faq.types"
import { FaqFilters, type FaqFilterState } from "./FaqFilters"
import { FaqTable } from "./FaqTable"
import type { ServiceOption } from "./faq-options"

type FaqsClientViewProps = {
  initialFaqs: Faq[]
  services: ServiceOption[]
  /** Pre-selected treatment filter, e.g. when coming from a service page */
  initialTreatment?: string
}

export function FaqsClientView({ initialFaqs, services, initialTreatment = "all" }: FaqsClientViewProps) {
  const [filters, setFilters] = useState<FaqFilterState>({
    search: "",
    treatment: initialTreatment,
  })

  return (
    <div className="space-y-4">
      <FaqFilters filters={filters} onFiltersChange={setFilters} services={services} />
      <FaqTable faqs={initialFaqs} filters={filters} />
    </div>
  )
}
