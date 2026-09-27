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
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/admin/ui/select"
import { GENERAL, GENERAL_LABEL, treatmentItems, type ServiceOption } from "./faq-options"

export type FaqFilterState = {
  search: string
  /** "all", "general" or a service id */
  treatment: string
}

type FaqFiltersProps = {
  filters: FaqFilterState
  onFiltersChange: (filters: FaqFilterState) => void
  services: ServiceOption[]
}

export function FaqFilters({ filters, onFiltersChange, services }: FaqFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      <InputGroup className="sm:flex-1 sm:max-w-sm">
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

      <Select
        items={{ all: "All Treatments", ...treatmentItems(services) }}
        value={filters.treatment}
        onValueChange={(val) => onFiltersChange({ ...filters, treatment: val ?? "all" })}
      >
        <SelectTrigger className="sm:w-56" aria-label="Filter by treatment">
          <SelectValue />
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false}>
          <SelectItem value="all">All Treatments</SelectItem>
          <SelectItem value={GENERAL}>{GENERAL_LABEL}</SelectItem>
          {services.length > 0 && <SelectSeparator />}
          {services.map((s) => (
            <SelectItem key={s.id} value={s.id}>
              {s.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
