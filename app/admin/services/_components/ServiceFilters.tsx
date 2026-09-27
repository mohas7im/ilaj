"use client"

import { Search } from "lucide-react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/admin/ui/input-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/admin/ui/select"
import type { ServiceStatus } from "@/domain/service/service.types"
import { SERVICE_STATUS_CONFIG } from "./service-status"

export type ServiceFilterState = {
  search: string
  status: ServiceStatus | "all"
}

type ServiceFiltersProps = {
  filters: ServiceFilterState
  onFiltersChange: (filters: ServiceFilterState) => void
}

export function ServiceFilters({ filters, onFiltersChange }: ServiceFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      <InputGroup className="sm:flex-1 sm:max-w-sm">
        <InputGroupInput
          value={filters.search}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          placeholder="Search services..."
          aria-label="Search services"
        />
        <InputGroupAddon>
          <Search aria-hidden="true" />
        </InputGroupAddon>
      </InputGroup>

      <Select
        value={filters.status}
        onValueChange={(val) =>
          onFiltersChange({ ...filters, status: (val ?? "all") as ServiceStatus | "all" })
        }
      >
        <SelectTrigger className="sm:w-40" aria-label="Filter by status">
          <SelectValue placeholder="All Statuses" />
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false}>
          <SelectItem value="all">All Statuses</SelectItem>
          {(Object.keys(SERVICE_STATUS_CONFIG) as ServiceStatus[]).map((s) => (
            <SelectItem key={s} value={s}>
              {SERVICE_STATUS_CONFIG[s].label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
