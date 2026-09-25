"use client"

import { useState } from "react"
import { ServiceFilters, type ServiceFilterState } from "./ServiceFilters"
import { ServiceTable } from "./ServiceTable"
import type { Service } from "@/domain/service/service.types"

export function ServicesClientView({ initialServices }: { initialServices: Service[] }) {
  const [filters, setFilters] = useState<ServiceFilterState>({
    search: "",
    status: "all",
  })

  return (
    <div className="space-y-4">
      <ServiceFilters filters={filters} onFiltersChange={setFilters} />
      <ServiceTable services={initialServices} filters={filters} />
    </div>
  )
}
