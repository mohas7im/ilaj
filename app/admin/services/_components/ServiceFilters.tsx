"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/admin/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/admin/ui/select"
import { SERVICE_STATUS_CONFIG, type ServiceStatus } from "../_types/service.types"

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
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <Input
          value={filters.search}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          placeholder="Search services..."
          className="pl-8 h-9"
          aria-label="Search services"
        />
      </div>

      <Select
        value={filters.status}
        onValueChange={(val) =>
          onFiltersChange({ ...filters, status: (val ?? "all") as ServiceStatus | "all" })
        }
      >
        <SelectTrigger className="w-full sm:w-40 h-9" aria-label="Filter by status">
          <SelectValue placeholder="All Statuses" />
        </SelectTrigger>
        <SelectContent>
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
