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

export type TestimonialFilterState = {
  search: string
  rating: string
}

type TestimonialFiltersProps = {
  filters: TestimonialFilterState
  onFiltersChange: (filters: TestimonialFilterState) => void
}

export function TestimonialFilters({
  filters,
  onFiltersChange,
}: TestimonialFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      <InputGroup className="sm:flex-1 sm:max-w-sm">
        <InputGroupInput
          value={filters.search}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          placeholder="Search patient, treatment..."
          aria-label="Search testimonials"
        />
        <InputGroupAddon>
          <Search aria-hidden="true" />
        </InputGroupAddon>
      </InputGroup>

      <Select
        value={filters.rating}
        onValueChange={(val) =>
          onFiltersChange({ ...filters, rating: val ?? "all" })
        }
      >
        <SelectTrigger className="sm:w-44" aria-label="Filter by rating">
          <SelectValue placeholder="All Ratings" />
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false}>
          <SelectItem value="all">All Ratings</SelectItem>
          <SelectItem value="5">5 Stars</SelectItem>
          <SelectItem value="4">4+ Stars</SelectItem>
          <SelectItem value="3">3+ Stars</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
