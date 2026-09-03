"use client"

import { useState } from "react"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { Input } from "@/components/admin/ui/input"
import { Button } from "@/components/admin/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/admin/ui/select"
import { APPOINTMENT_STATUSES, APPOINTMENT_STATUS_CONFIG } from "../config"
import type { AppointmentFilterState, AppointmentStatus } from "../types"
import type { Doctor } from "@/features/admin/doctors/types"

type AppointmentFiltersProps = {
  filters: AppointmentFilterState
  onFiltersChange: (filters: AppointmentFilterState) => void
  doctors: Doctor[]
}

export function AppointmentFilters({
  filters,
  onFiltersChange,
  doctors,
}: AppointmentFiltersProps) {
  const hasActiveFilters =
    filters.search !== "" ||
    filters.status !== "all" ||
    filters.doctorId !== ""

  const reset = () =>
    onFiltersChange({ search: "", status: "all", doctorId: "" })

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Search */}
      <div className="relative min-w-[200px] flex-1">
        <Search
          className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          value={filters.search}
          onChange={(e) =>
            onFiltersChange({ ...filters, search: e.target.value })
          }
          placeholder="Search patient or doctor..."
          className="pl-8 h-9"
          aria-label="Search appointments"
        />
      </div>

      {/* Status filter */}
      <Select
        value={filters.status}
        onValueChange={(val) =>
          onFiltersChange({
            ...filters,
            status: (val ?? "all") as AppointmentStatus | "all",
          })
        }
      >
        <SelectTrigger className="h-9 w-[150px]" aria-label="Filter by status">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          {APPOINTMENT_STATUSES.map((s) => (
            <SelectItem key={s} value={s}>
              {APPOINTMENT_STATUS_CONFIG[s].label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Doctor filter */}
      <Select
        value={filters.doctorId}
        onValueChange={(val) =>
          onFiltersChange({ ...filters, doctorId: val ?? "" })
        }
      >
        <SelectTrigger className="h-9 w-[160px]" aria-label="Filter by doctor">
          <SelectValue placeholder="Doctor" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Doctors</SelectItem>
          {doctors.map((d) => (
            <SelectItem key={d.id} value={d.id}>
              {d.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Reset */}
      {hasActiveFilters && (
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
