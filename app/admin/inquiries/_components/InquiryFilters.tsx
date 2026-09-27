"use client"

import { useState, useEffect } from "react"
import { CalendarIcon, Search, X } from "lucide-react"
import { format } from "date-fns"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/admin/ui/input-group"
import { Button } from "@/components/admin/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/admin/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/admin/ui/popover"
import { Calendar } from "@/components/admin/ui/calendar"
import { fetchTreatmentServices } from "../_services/inquiry.api"

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
  const [treatmentOptions, setTreatmentOptions] = useState<string[]>([])

  useEffect(() => {
    let isMounted = true
    fetchTreatmentServices().then((services) => {
      if (isMounted && Array.isArray(services)) {
        setTreatmentOptions(services)
      }
    })
    return () => {
      isMounted = false
    }
  }, [])

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
      <InputGroup className="min-w-[240px] flex-1">
        <InputGroupInput
          value={filters.search}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          placeholder="Search by name, email, phone, or message..."
          aria-label="Search inquiries"
        />
        <InputGroupAddon>
          <Search aria-hidden="true" />
        </InputGroupAddon>
      </InputGroup>

      {/* Treatment filter */}
      <Select
        value={filters.treatment}
        onValueChange={(v) => onFiltersChange({ ...filters, treatment: v ?? "all" })}
      >
        <SelectTrigger className="w-[210px]" aria-label="Filter by treatment">
          <SelectValue placeholder="All Treatments" />
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false}>
          <SelectItem value="all">All Treatments</SelectItem>
          {treatmentOptions.map((t) => (
            <SelectItem key={t} value={t}>{t}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Date From */}
      <Popover>
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              data-empty={!filters.dateFrom}
              className="w-[150px] justify-start font-normal data-[empty=true]:text-muted-foreground"
            />
          }
          aria-label="Filter from date"
        >
          <CalendarIcon data-icon="inline-start" aria-hidden="true" />
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
          render={
            <Button
              variant="outline"
              data-empty={!filters.dateTo}
              className="w-[150px] justify-start font-normal data-[empty=true]:text-muted-foreground"
            />
          }
          aria-label="Filter to date"
        >
          <CalendarIcon data-icon="inline-start" aria-hidden="true" />
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
          onClick={reset}
          className="text-muted-foreground"
          aria-label="Reset filters"
        >
          <X data-icon="inline-start" aria-hidden="true" />
          Reset
        </Button>
      )}
    </div>
  )
}
