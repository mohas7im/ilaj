"use client"

import { useState } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/admin/ui/input"
import { Button } from "@/components/admin/ui/button"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/admin/ui/select"
import { INQUIRY_STATUSES, INQUIRY_STATUS_CONFIG } from "../config"
import type { InquiryStatus } from "../types"

export type InquiryFilterState = {
  search: string
  status: InquiryStatus | "all"
}

type InquiryFiltersProps = {
  filters: InquiryFilterState
  onFiltersChange: (filters: InquiryFilterState) => void
}

export function InquiryFilters({ filters, onFiltersChange }: InquiryFiltersProps) {
  const hasActive = filters.search !== "" || filters.status !== "all"
  const reset = () => onFiltersChange({ search: "", status: "all" })

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative min-w-[200px] flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <Input
          value={filters.search}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          placeholder="Search name, email, or subject..."
          className="pl-8 h-9"
          aria-label="Search inquiries"
        />
      </div>

      <Select
        value={filters.status}
        onValueChange={(v) => onFiltersChange({ ...filters, status: (v ?? "all") as InquiryStatus | "all" })}
      >
        <SelectTrigger className="h-9 w-[150px]" aria-label="Filter by status">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          {INQUIRY_STATUSES.map((s) => (
            <SelectItem key={s} value={s}>{INQUIRY_STATUS_CONFIG[s].label}</SelectItem>
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
