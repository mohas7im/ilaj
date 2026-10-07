"use client"

import { useState } from "react"
import { Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/admin/ui/table"
import { Button } from "@/components/admin/ui/button"
import { Avatar, AvatarFallback } from "@/components/admin/ui/avatar"
import { Badge } from "@/components/admin/ui/badge"
import { EmptyState } from "@/components/admin/ui/empty-state"
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog"
import { TableLoadingState } from "@/components/admin/ui/loading-state"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/admin/ui/select"
import type { Inquiry } from "@/domain/inquiry/inquiry.types"

const PAGE_SIZE_OPTIONS = [10, 20, 50]

type InquiryTableProps = {
  inquiries: Inquiry[]
  isLoading?: boolean
  pageNumber: number
  pageSize: number
  total: number
  totalPages: number
  onPageChange: (pageNumber: number) => void
  onPageSizeChange: (pageSize: number) => void
  onDelete: (id: string) => Promise<void>
}

function initials(name: string) {
  return (
    name
      .split(" ")
      .map((n) => n[0])
      .filter(Boolean)
      .join("")
      .toUpperCase()
      .slice(0, 2) || "IN"
  )
}

export function InquiryTable({
  inquiries,
  isLoading = false,
  pageNumber,
  pageSize,
  total,
  totalPages,
  onPageChange,
  onPageSizeChange,
  onDelete,
}: InquiryTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      setIsDeleting(true)
      await onDelete(deleteId)
      setDeleteId(null)
    } finally {
      setIsDeleting(false)
    }
  }

  // Proper loading state using standard admin TableLoadingState component
  if (isLoading) {
    return <TableLoadingState rows={Math.min(pageSize, 8)} cols={7} />
  }

  // Empty state when not loading and no items match
  if (inquiries.length === 0) {
    return (
      <EmptyState
        title="No inquiries found"
        description="Adjust your search or filters to see more results."
      />
    )
  }

  const startRecord = total === 0 ? 0 : (pageNumber - 1) * pageSize + 1
  const endRecord = Math.min(pageNumber * pageSize, total)

  return (
    <div className="space-y-3">
      <div className="rounded-md border bg-card overflow-x-auto">
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
            {inquiries.map((inq) => {
              const displayName = inq.fullName
              const slot =
                [inq.preferredDate, inq.preferredTime]
                  .filter(Boolean)
                  .join(" • ") || "—"

              return (
                <TableRow key={inq.id}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-9 w-9 shrink-0">
                        <AvatarFallback className="text-xs">
                          {initials(displayName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col min-w-0">
                        <span className="font-medium text-sm truncate">
                          {displayName}
                        </span>
                        <span className="text-xs text-muted-foreground sm:hidden truncate">
                          {inq.phone || inq.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span>{inq.treatment}</span>
                      {inq.type === "inquiry" && <Badge variant="secondary">Question</Badge>}
                      {inq.emailStatus === "failed" && <Badge variant="destructive">Email failed</Badge>}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {slot}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                    {inq.email}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                    {inq.phone || "—"}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(inq.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="outline"
                        size="icon-sm"
                        title="Delete inquiry"
                        aria-label={`Delete inquiry from ${displayName}`}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
                        onClick={() => setDeleteId(inq.id)}
                      >
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
            {total === 0
              ? "No results"
              : `${startRecord}–${endRecord} of ${total}`}
          </span>
          <span className="text-muted-foreground/50">|</span>
          <span>Rows per page:</span>
          <Select
            value={String(pageSize)}
            onValueChange={(v) => {
              onPageSizeChange(Number(v))
            }}
          >
            <SelectTrigger size="sm" className="w-[68px] text-xs" aria-label="Rows per page">
              <SelectValue />
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false}>
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
            onClick={() => onPageChange(Math.max(1, pageNumber - 1))}
            disabled={pageNumber <= 1}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === totalPages || Math.abs(p - pageNumber) <= 1)
            .reduce<(number | "…")[]>((acc, p, idx, arr) => {
              if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) acc.push("…")
              acc.push(p)
              return acc
            }, [])
            .map((item, idx) =>
              item === "…" ? (
                <span key={`ellipsis-${idx}`} className="px-1">
                  …
                </span>
              ) : (
                <button
                  key={item}
                  onClick={() => onPageChange(item as number)}
                  className={`min-w-[28px] h-7 px-2 rounded text-xs transition-colors ${
                    pageNumber === item
                      ? "bg-primary text-primary-foreground font-medium"
                      : "hover:bg-muted"
                  }`}
                  aria-label={`Go to page ${item}`}
                  aria-current={pageNumber === item ? "page" : undefined}
                >
                  {item}
                </button>
              )
            )}

          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => onPageChange(Math.min(totalPages, pageNumber + 1))}
            disabled={pageNumber >= totalPages}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && !isDeleting && setDeleteId(null)}
        title="Delete inquiry?"
        description="This will permanently delete the inquiry and all its submitted data."
        confirmLabel="Delete"
        isLoading={isDeleting}
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  )
}
