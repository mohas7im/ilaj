"use client"

import { Search, X } from "lucide-react"
import { Input } from "@/components/admin/ui/input"
import { Button } from "@/components/admin/ui/button"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/admin/ui/select"
import { TREATMENT_OPTIONS } from "../_services/inquiry.service"

export type InquiryFilterState = {
  search: string
  treatment: string | "all"
}

type InquiryFiltersProps = {
  filters: InquiryFilterState
  onFiltersChange: (filters: InquiryFilterState) => void
}

export function InquiryFilters({ filters, onFiltersChange }: InquiryFiltersProps) {
  const hasActive = filters.search !== "" || filters.treatment !== "all"
  const reset = () => onFiltersChange({ search: "", treatment: "all" })

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative min-w-[240px] flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <Input
          value={filters.search}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          placeholder="Search by name, email, phone, or treatment..."
          className="pl-8 h-9"
          aria-label="Search inquiries"
        />
      </div>

      {/* Treatment filter */}
      <Select
        value={filters.treatment}
        onValueChange={(v) => onFiltersChange({ ...filters, treatment: v ?? "all" })}
      >
        <SelectTrigger className="h-9 w-[190px]" aria-label="Filter by treatment">
          <SelectValue placeholder="All Treatments" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Treatments</SelectItem>
          {TREATMENT_OPTIONS.map((t) => (
            <SelectItem key={t} value={t}>{t}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasActive && (
        <Button
          variant="ghost"
          size="sm"
          onClick={reset}
          className="h-9 px-2 text-muted-foreground"
          aria-label="Reset filters"
        >
          <X className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
          Reset
        </Button>
      )}
    </div>
  )
}
