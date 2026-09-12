"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, Trash2 } from "lucide-react"
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/admin/ui/table"
import { Button } from "@/components/admin/ui/button"
import { Avatar, AvatarFallback } from "@/components/admin/ui/avatar"
import { EmptyState } from "@/components/admin/ui/empty-state"
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog"
import type { Inquiry } from "../_types/inquiry.types"
import type { InquiryFilterState } from "./InquiryFilters"

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

  const filtered = inquiries.filter((inq) => {
    const q = filters.search.toLowerCase().trim()
    const name = inq.fullName || inq.name || ""
    const treatment = inq.treatment || inq.subject || ""
    const matchSearch = !q || name.toLowerCase().includes(q) || inq.email.toLowerCase().includes(q) || inq.phone?.toLowerCase().includes(q) || treatment.toLowerCase().includes(q)
    const matchTreatment = filters.treatment === "all" || inq.treatment === filters.treatment
    return matchSearch && matchTreatment
  })

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
              {filtered.map((inq) => {
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
