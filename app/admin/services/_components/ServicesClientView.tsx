"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { ServiceFilters, type ServiceFilterState } from "./ServiceFilters"
import { ServiceTable } from "./ServiceTable"
import { serviceApiService } from "../_services/service.api"
import { getApiErrorMessage } from "@/lib/api/errors"
import { LoadingState } from "@/components/admin/ui/loading-state"
import type { Service } from "@/domain/service/service.types"

export function ServicesClientView() {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<ServiceFilterState>({
    search: "",
    status: "all",
  })

  useEffect(() => {
    serviceApiService
      .getAll()
      .then(setServices)
      .catch((error) => toast.error(getApiErrorMessage(error, "Failed to load services")))
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) {
    return <LoadingState spinner label="Loading services..." />
  }

  return (
    <div className="space-y-4">
      <ServiceFilters filters={filters} onFiltersChange={setFilters} />
      <ServiceTable services={services} filters={filters} />
    </div>
  )
}
