"use client"

import { Search } from "lucide-react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/admin/ui/input-group"

export type FaqFilterState = {
  search: string
}

type FaqFiltersProps = {
  filters: FaqFilterState
  onFiltersChange: (filters: FaqFilterState) => void
}

export function FaqFilters({ filters, onFiltersChange }: FaqFiltersProps) {
  return (
    <InputGroup className="sm:max-w-sm">
      <InputGroupInput
        value={filters.search}
        onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
        placeholder="Search question or answer..."
        aria-label="Search FAQs"
      />
      <InputGroupAddon>
        <Search aria-hidden="true" />
      </InputGroupAddon>
    </InputGroup>
  )
}
