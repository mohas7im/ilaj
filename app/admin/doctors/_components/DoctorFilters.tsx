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

export type DoctorFilterState = {
  search: string
  specialization: string
}

type DoctorFiltersProps = {
  filters: DoctorFilterState
  onFiltersChange: (filters: DoctorFilterState) => void
  /** Distinct specializations of the saved doctors */
  specializations: string[]
}

export function DoctorFilters({
  filters,
  onFiltersChange,
  specializations,
}: DoctorFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      <InputGroup className="sm:flex-1 sm:max-w-sm">
        <InputGroupInput
          value={filters.search}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          placeholder="Search doctor name..."
          aria-label="Search doctor name"
        />
        <InputGroupAddon>
          <Search aria-hidden="true" />
        </InputGroupAddon>
      </InputGroup>

      <Select
        value={filters.specialization}
        onValueChange={(val) =>
          onFiltersChange({ ...filters, specialization: val ?? "all" })
        }
      >
        <SelectTrigger className="sm:w-48" aria-label="Filter by specialization">
          <SelectValue placeholder="All Specializations" />
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false}>
          <SelectItem value="all">All Specializations</SelectItem>
          {specializations.map((spec) => (
            <SelectItem key={spec} value={spec}>
              {spec}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
