"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import type { Faq } from "@/domain/faq/faq.types"
import { FaqFilters, type FaqFilterState } from "./FaqFilters"
import { FaqTable } from "./FaqTable"
import { faqApiService } from "../_services/faq.api"
import { getApiErrorMessage } from "@/lib/api/errors"
import { LoadingState } from "@/components/admin/ui/loading-state"

export function FaqsClientView() {
  const [faqs, setFaqs] = useState<Faq[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<FaqFilterState>({ search: "" })

  useEffect(() => {
    faqApiService
      .getAll()
      .then(setFaqs)
      .catch((error) => toast.error(getApiErrorMessage(error, "Failed to load FAQs")))
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) {
    return <LoadingState spinner label="Loading FAQs..." />
  }

  return (
    <div className="space-y-4">
      <FaqFilters filters={filters} onFiltersChange={setFilters} />
      <FaqTable faqs={faqs} filters={filters} />
    </div>
  )
}
