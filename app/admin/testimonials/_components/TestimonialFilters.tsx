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
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <Input
          value={filters.search}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          placeholder="Search patient, treatment..."
          className="pl-8 h-9"
          aria-label="Search testimonials"
        />
      </div>

      <Select
        value={filters.rating}
        onValueChange={(val) =>
          onFiltersChange({ ...filters, rating: val ?? "all" })
        }
      >
        <SelectTrigger className="w-full sm:w-44 h-9" aria-label="Filter by rating">
          <SelectValue placeholder="All Ratings" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Ratings</SelectItem>
          <SelectItem value="5">5 Stars</SelectItem>
          <SelectItem value="4">4+ Stars</SelectItem>
          <SelectItem value="3">3+ Stars</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
