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

export type DoctorFilterState = {
  search: string
  specialization: string
}

type DoctorFiltersProps = {
  filters: DoctorFilterState
  onFiltersChange: (filters: DoctorFilterState) => void
  specializations?: string[]
}

export function DoctorFilters({
  filters,
  onFiltersChange,
  specializations = [
    "Orthodontics",
    "Periodontics",
    "Endodontics",
    "Prosthodontics",
    "Oral & Maxillofacial Surgery",
    "Cosmetic Dentistry",
    "Pediatric Dentistry",
  ],
}: DoctorFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <Input
          value={filters.search}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          placeholder="Search doctor name..."
          className="pl-8 h-9"
          aria-label="Search doctor name"
        />
      </div>

      <Select
        value={filters.specialization}
        onValueChange={(val) =>
          onFiltersChange({ ...filters, specialization: val ?? "all" })
        }
      >
        <SelectTrigger className="w-full sm:w-48 h-9" aria-label="Filter by specialization">
          <SelectValue placeholder="All Specializations" />
        </SelectTrigger>
        <SelectContent>
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
