"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/admin/ui/input"

export type PatientFilterState = {
  search: string
}

type PatientFiltersProps = {
  filters: PatientFilterState
  onFiltersChange: (filters: PatientFilterState) => void
}

export function PatientFilters({ filters, onFiltersChange }: PatientFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <Input
          value={filters.search}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          placeholder="Search patient name, phone, or email..."
          className="pl-8 h-9"
          aria-label="Search patients"
        />
      </div>
    </div>
  )
}
