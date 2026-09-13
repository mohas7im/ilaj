"use client"

import { CalendarIcon, Search, X } from "lucide-react"
import { format } from "date-fns"
import { Input } from "@/components/admin/ui/input"
import { Button } from "@/components/admin/ui/button"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/admin/ui/select"
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/admin/ui/popover"
import { Calendar } from "@/components/admin/ui/calendar"
import { TREATMENT_OPTIONS } from "../_services/inquiry.service"

export type InquiryFilterState = {
  search: string
  treatment: string | "all"
  dateFrom: Date | undefined
  dateTo: Date | undefined
}

type InquiryFiltersProps = {
  filters: InquiryFilterState
  onFiltersChange: (filters: InquiryFilterState) => void
}

export function InquiryFilters({ filters, onFiltersChange }: InquiryFiltersProps) {
  const hasActive =
    filters.search !== "" ||
    filters.treatment !== "all" ||
    filters.dateFrom !== undefined ||
    filters.dateTo !== undefined

  const reset = () =>
    onFiltersChange({ search: "", treatment: "all", dateFrom: undefined, dateTo: undefined })

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Search */}
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

      {/* Date From */}
      <Popover>
        <PopoverTrigger
          className={`inline-flex h-9 w-[150px] items-center justify-start gap-2 rounded-md border border-input bg-background px-3 text-sm font-normal transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${!filters.dateFrom ? "text-muted-foreground" : ""}`}
          aria-label="Filter from date"
        >
          <CalendarIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
          {filters.dateFrom ? format(filters.dateFrom, "dd MMM yyyy") : "From date"}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={filters.dateFrom}
            onSelect={(date) => onFiltersChange({ ...filters, dateFrom: date ?? undefined })}
            disabled={(date) => (filters.dateTo ? date > filters.dateTo : false)}
          />
        </PopoverContent>
      </Popover>

      {/* Date To */}
      <Popover>
        <PopoverTrigger
          className={`inline-flex h-9 w-[150px] items-center justify-start gap-2 rounded-md border border-input bg-background px-3 text-sm font-normal transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${!filters.dateTo ? "text-muted-foreground" : ""}`}
          aria-label="Filter to date"
        >
          <CalendarIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
          {filters.dateTo ? format(filters.dateTo, "dd MMM yyyy") : "To date"}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={filters.dateTo}
            onSelect={(date) => onFiltersChange({ ...filters, dateTo: date ?? undefined })}
            disabled={(date) => (filters.dateFrom ? date < filters.dateFrom : false)}
          />
        </PopoverContent>
      </Popover>

      {/* Reset */}
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
