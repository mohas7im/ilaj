"use client"

import { useState } from "react"
import { PageHeader } from "@/components/admin/PageHeader"
import { ServiceFilters, type ServiceFilterState } from "./_components/ServiceFilters"
import { ServiceTable } from "./_components/ServiceTable"
import { MOCK_SERVICES } from "./_services/service.service"

export default function ServicesPage() {
  const [filters, setFilters] = useState<ServiceFilterState>({
    search: "",
    status: "all",
  })

  return (
    <div className="space-y-5">
      <PageHeader
        title="Services"
        description="Manage the dental services offered by the clinic."
        actions={[{ label: "+ Add Service", href: "/admin/services/create" }]}
      />
      <ServiceFilters filters={filters} onFiltersChange={setFilters} />
      <ServiceTable services={MOCK_SERVICES} filters={filters} />
    </div>
  )
}
