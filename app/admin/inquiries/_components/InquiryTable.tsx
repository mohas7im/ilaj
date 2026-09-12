"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, Trash2 } from "lucide-react"
import { DataTable, type ColumnDef } from "@/components/admin/DataTable"
import { Button } from "@/components/admin/ui/button"
import { Avatar, AvatarFallback } from "@/components/admin/ui/avatar"
import { ConfirmDialog } from "@/components/admin/ConfirmDialog"
import type { Inquiry } from "../_types/inquiry.types"
import type { InquiryFilterState } from "./InquiryFilters"

type InquiryTableProps = {
  inquiries: Inquiry[]
  filters: InquiryFilterState
}

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function InquiryTable({ inquiries: initialInquiries, filters }: InquiryTableProps) {
  const [inquiries, setInquiries] = useState<Inquiry[]>(initialInquiries)
  const [deleteId, setDeleteId] = useState<string | null>(null)

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

  const columns: ColumnDef<Inquiry>[] = [
    {
      key: "fullName",
      header: "Patient",
      sortable: true,
      cell: (inq) => {
        const displayName = inq.fullName || inq.name || "Anonymous"
        return (
          <div className="flex items-center gap-2.5">
            <Avatar className="h-9 w-9 shrink-0">
              <AvatarFallback className="text-xs">
                {initials(displayName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-sm">{displayName}</span>
              <span className="text-xs text-muted-foreground sm:hidden">
                {inq.phone || inq.email}
              </span>
            </div>
          </div>
        )
      },
    },
    {
      key: "treatment",
      header: "Treatment",
      sortable: true,
      className: "hidden sm:table-cell text-sm text-muted-foreground",
      cell: (inq) => inq.treatment || inq.subject || "General Checkup",
    },
    {
      key: "preferredDate",
      header: "Preferred Slot",
      className: "hidden md:table-cell text-sm text-muted-foreground",
      cell: (inq) => (
        <span>
          {inq.preferredDate || "—"} {inq.preferredTime ? `• ${inq.preferredTime}` : ""}
        </span>
      ),
    },
    {
      key: "email",
      header: "Email",
      sortable: true,
      className: "hidden lg:table-cell text-sm text-muted-foreground",
    },
    {
      key: "phone",
      header: "Phone",
      className: "hidden lg:table-cell text-sm text-muted-foreground",
      cell: (inq) => inq.phone || "—",
    },
    {
      key: "createdAt",
      header: "Received",
      sortable: true,
      className: "hidden sm:table-cell text-xs text-muted-foreground",
      cell: (inq) => new Date(inq.createdAt).toLocaleDateString(),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      cell: (inq) => {
        const displayName = inq.fullName || inq.name || "Anonymous"
        return (
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="outline"
              size="icon-sm"
              title="View details"
              aria-label={`View inquiry from ${displayName}`}
              render={<Link href={`/admin/inquiries/${inq.id}`} />}
            >
              <Eye className="h-4 w-4" aria-hidden="true" />
            </Button>
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
        )
      },
    },
  ]

  return (
    <>
      <DataTable
        data={filtered}
        columns={columns}
        rowKey={(inq) => inq.id}
        emptyTitle="No inquiries found"
        emptyDescription="Adjust your search or filters to see more results."
      />

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete inquiry?"
        description="This will permanently delete the inquiry and all its submitted data."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </>
  )
}
