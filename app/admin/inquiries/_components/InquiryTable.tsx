"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, Trash2, MoreHorizontal } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/admin/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/admin/ui/dropdown-menu"
import { Button } from "@/components/admin/ui/button"
import { EmptyState } from "@/components/admin/EmptyState"
import { ConfirmDialog } from "@/components/admin/ConfirmDialog"
import type { Inquiry } from "../_types/inquiry.types"
import type { InquiryFilterState } from "./InquiryFilters"

type InquiryTableProps = {
  inquiries: Inquiry[]
  filters: InquiryFilterState
}

export function InquiryTable({ inquiries: initialInquiries, filters }: InquiryTableProps) {
  const [inquiries, setInquiries] = useState<Inquiry[]>(initialInquiries)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filtered = inquiries.filter((inq) => {
    const q = filters.search.toLowerCase()
    const name = inq.fullName || inq.name || ""
    const treatment = inq.treatment || inq.subject || ""
    const matchSearch =
      !q ||
      name.toLowerCase().includes(q) ||
      inq.email.toLowerCase().includes(q) ||
      inq.phone?.toLowerCase().includes(q) ||
      treatment.toLowerCase().includes(q)

    const matchTreatment = filters.treatment === "all" || inq.treatment === filters.treatment
    return matchSearch && matchTreatment
  })

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await fetch(`/api/inquiries/${deleteId}`, { method: "DELETE" })
      } catch {
        // Fallback
      }
      setInquiries((prev) => prev.filter((i) => i.id !== deleteId))
      setDeleteId(null)
    }
  }

  if (filtered.length === 0) {
    return (
      <EmptyState
        title="No inquiries found"
        description="Adjust your search or filters to see more results."
      />
    )
  }

  return (
    <>
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Treatment</TableHead>
              <TableHead className="hidden md:table-cell">Preferred Slot</TableHead>
              <TableHead className="hidden lg:table-cell">Email</TableHead>
              <TableHead className="hidden lg:table-cell">Phone</TableHead>
              <TableHead className="hidden sm:table-cell">Received</TableHead>
              <TableHead className="w-8">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((inq) => {
              const displayName = inq.fullName || inq.name || "Anonymous"
              return (
                <TableRow key={inq.id}>
                  <TableCell className="font-medium text-foreground">
                    {displayName}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {inq.treatment || inq.subject || "General Checkup"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground text-xs">
                    {inq.preferredDate || "—"} {inq.preferredTime ? `• ${inq.preferredTime}` : ""}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                    {inq.email}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                    {inq.phone || "—"}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground text-xs">
                    {new Date(inq.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Actions for inquiry from ${displayName}`}
                          >
                            <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                          </Button>
                        }
                      />
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem render={<Link href={`/admin/inquiries/${inq.id}`} />}>
                          <Eye className="mr-2 h-4 w-4" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onSelect={() => setDeleteId(inq.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete inquiry?"
        description="This will permanently delete the inquiry and all its data."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </>
  )
}
