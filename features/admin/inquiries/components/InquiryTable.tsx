"use client"

import { useState } from "react"
import Link from "next/link"
import { MoreHorizontal, Eye, Trash2 } from "lucide-react"
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/admin/ui/table"
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/admin/ui/dropdown-menu"
import { EmptyState } from "@/components/admin/common/EmptyState"
import { ConfirmDialog } from "@/components/admin/common/ConfirmDialog"
import { InquiryStatusBadge } from "./InquiryStatusBadge"
import type { Inquiry } from "../types"
import type { InquiryFilterState } from "./InquiryFilters"

type InquiryTableProps = {
  inquiries: Inquiry[]
  filters: InquiryFilterState
}

export function InquiryTable({ inquiries, filters }: InquiryTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filtered = inquiries.filter((inq) => {
    const q = filters.search.toLowerCase()
    const matchSearch =
      !q ||
      inq.name.toLowerCase().includes(q) ||
      inq.email.toLowerCase().includes(q) ||
      inq.subject.toLowerCase().includes(q)
    const matchStatus = filters.status === "all" || inq.status === filters.status
    return matchSearch && matchStatus
  })

  if (filtered.length === 0) {
    return (
      <EmptyState
        title="No inquiries found"
        description="Adjust your filters to see more results."
      />
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden sm:table-cell">Subject</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden lg:table-cell">Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden sm:table-cell">Received</TableHead>
              <TableHead className="w-8"><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((inq) => (
              <TableRow key={inq.id}>
                <TableCell className="font-medium">{inq.name}</TableCell>
                <TableCell className="hidden sm:table-cell text-muted-foreground max-w-[200px]">
                  <span className="line-clamp-1">{inq.subject}</span>
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">{inq.email}</TableCell>
                <TableCell className="hidden lg:table-cell text-muted-foreground">{inq.phone ?? "—"}</TableCell>
                <TableCell>
                  <InquiryStatusBadge status={inq.status} />
                </TableCell>
                <TableCell className="hidden sm:table-cell text-muted-foreground text-xs">
                  {new Date(inq.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <button
                          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          aria-label={`Actions for inquiry from ${inq.name}`}
                        >
                          <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                        </button>
                      }
                    />
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem render={<Link href={`/admin/inquiries/${inq.id}`} />}>
                        <Eye className="mr-2 h-4 w-4" /> View
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
            ))}
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
        onConfirm={() => {
          // TODO: call DELETE /api/admin/inquiries/:id
          setDeleteId(null)
        }}
      />
    </>
  )
}
