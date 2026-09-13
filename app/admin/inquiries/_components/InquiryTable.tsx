"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/admin/ui/table"
import { Button } from "@/components/admin/ui/button"
import { Avatar, AvatarFallback } from "@/components/admin/ui/avatar"
import { EmptyState } from "@/components/admin/ui/empty-state"
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/admin/ui/select"
import type { Inquiry } from "../_types/inquiry.types"
import type { InquiryFilterState } from "./InquiryFilters"

const PAGE_SIZE_OPTIONS = [10, 20, 50]

type InquiryTableProps = {
  inquiries: Inquiry[]
  filters: InquiryFilterState
}

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
}

export function InquiryTable({ inquiries: initialInquiries, filters }: InquiryTableProps) {
  const [inquiries, setInquiries] = useState<Inquiry[]>(initialInquiries)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Filter
  const filtered = inquiries.filter((inq) => {
    const q = filters.search.toLowerCase().trim()
    const name = inq.fullName || inq.name || ""
    const treatment = inq.treatment || inq.subject || ""
    const matchSearch =
      !q ||
      name.toLowerCase().includes(q) ||
      inq.email.toLowerCase().includes(q) ||
      inq.phone?.toLowerCase().includes(q) ||
      treatment.toLowerCase().includes(q)
    const matchTreatment = filters.treatment === "all" || inq.treatment === filters.treatment

    // Date range filter on createdAt
    const createdAt = new Date(inq.createdAt)
    const matchFrom = !filters.dateFrom || createdAt >= new Date(filters.dateFrom.setHours(0, 0, 0, 0))
    const matchTo = !filters.dateTo || createdAt <= new Date(filters.dateTo.setHours(23, 59, 59, 999))

    return matchSearch && matchTreatment && matchFrom && matchTo
  })

  // Reset to page 1 when filters change — handled via key prop derivation below
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)

  const handleDelete = async () => {
    if (deleteId) {
      try { await fetch(`/api/inquiries/${deleteId}`, { method: "DELETE" }) } catch {}
      setInquiries((prev) => prev.filter((i) => i.id !== deleteId))
      setDeleteId(null)
    }
  }

  return (
    <div className="space-y-3">
      {filtered.length === 0 ? (
        <EmptyState
          title="No inquiries found"
          description="Adjust your search or filters to see more results."
        />
      ) : (
        <>
          <div className="rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead className="hidden sm:table-cell">Treatment</TableHead>
                  <TableHead className="hidden md:table-cell">Preferred Slot</TableHead>
                  <TableHead className="hidden lg:table-cell">Email</TableHead>
                  <TableHead className="hidden lg:table-cell">Phone</TableHead>
                  <TableHead className="hidden sm:table-cell">Received</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((inq) => {
                  const displayName = inq.fullName || inq.name || "Anonymous"
                  return (
                    <TableRow key={inq.id}>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <Avatar className="h-9 w-9 shrink-0">
                            <AvatarFallback className="text-xs">{initials(displayName)}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">{displayName}</span>
                            <span className="text-xs text-muted-foreground sm:hidden">{inq.phone || inq.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                        {inq.treatment || inq.subject || "General Checkup"}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                        {inq.preferredDate || "—"}{inq.preferredTime ? ` • ${inq.preferredTime}` : ""}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                        {inq.email}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                        {inq.phone || "—"}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="outline" size="icon-sm" title="View details" aria-label={`View inquiry from ${displayName}`} render={<Link href={`/admin/inquiries/${inq.id}`} />}>
                            <Eye className="h-4 w-4" aria-hidden="true" />
                          </Button>
                          <Button variant="outline" size="icon-sm" title="Delete inquiry" aria-label={`Delete inquiry from ${displayName}`} className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30" onClick={() => setDeleteId(inq.id)}>
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {/* Pagination bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-sm text-muted-foreground">
            {/* Results count + page size */}
            <div className="flex items-center gap-2">
              <span>
                {filtered.length === 0
                  ? "No results"
                  : `${(safePage - 1) * pageSize + 1}–${Math.min(safePage * pageSize, filtered.length)} of ${filtered.length}`}
              </span>
              <span className="text-muted-foreground/50">|</span>
              <span>Rows per page:</span>
              <Select
                value={String(pageSize)}
                onValueChange={(v) => { setPageSize(Number(v)); setPage(1) }}
              >
                <SelectTrigger className="h-7 w-[68px] text-xs" aria-label="Rows per page">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAGE_SIZE_OPTIONS.map((size) => (
                    <SelectItem key={size} value={String(size)} className="text-xs">
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Page navigation */}
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage <= 1}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
                .reduce<(number | "…")[]>((acc, p, idx, arr) => {
                  if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) acc.push("…")
                  acc.push(p)
                  return acc
                }, [])
                .map((item, idx) =>
                  item === "…" ? (
                    <span key={`ellipsis-${idx}`} className="px-1">…</span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => setPage(item as number)}
                      className={`min-w-[28px] h-7 px-2 rounded text-xs transition-colors ${
                        safePage === item
                          ? "bg-primary text-primary-foreground font-medium"
                          : "hover:bg-muted"
                      }`}
                      aria-label={`Go to page ${item}`}
                      aria-current={safePage === item ? "page" : undefined}
                    >
                      {item}
                    </button>
                  )
                )}

              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage >= totalPages}
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete inquiry?"
        description="This will permanently delete the inquiry and all its submitted data."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  )
}
