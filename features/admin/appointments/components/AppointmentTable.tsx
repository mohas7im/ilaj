"use client"

import { useState } from "react"
import Link from "next/link"
import { MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react"
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/admin/ui/table"
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/admin/ui/dropdown-menu"
import { Button } from "@/components/admin/ui/button"
import { EmptyState } from "@/components/admin/common/EmptyState"
import { ConfirmDialog } from "@/components/admin/common/ConfirmDialog"
import { AppointmentStatusBadge } from "./AppointmentStatusBadge"
import type { Appointment } from "../types"
import type { AppointmentFilterState } from "../types"

type AppointmentTableProps = {
  appointments: Appointment[]
  filters: AppointmentFilterState
}

export function AppointmentTable({ appointments, filters }: AppointmentTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Apply filters
  const filtered = appointments.filter((a) => {
    const q = filters.search.toLowerCase()
    const matchSearch =
      !q ||
      a.patient.toLowerCase().includes(q) ||
      a.doctor.toLowerCase().includes(q) ||
      a.service.toLowerCase().includes(q)
    const matchStatus = filters.status === "all" || a.status === filters.status
    const matchDoctor = !filters.doctorId || a.doctorId === filters.doctorId
    return matchSearch && matchStatus && matchDoctor
  })

  if (filtered.length === 0) {
    return (
      <EmptyState
        title="No appointments found"
        description="Try adjusting your filters or create a new appointment."
        action={{ label: "New Appointment", href: "/admin/appointments/new" }}
      />
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead className="hidden sm:table-cell">Doctor</TableHead>
              <TableHead className="hidden md:table-cell">Service</TableHead>
              <TableHead className="hidden lg:table-cell">Date</TableHead>
              <TableHead className="hidden lg:table-cell">Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-8"><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((appt) => (
              <TableRow key={appt.id}>
                <TableCell className="font-medium">{appt.patient}</TableCell>
                <TableCell className="hidden sm:table-cell text-muted-foreground">{appt.doctor}</TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">{appt.service}</TableCell>
                <TableCell className="hidden lg:table-cell text-muted-foreground">{appt.date}</TableCell>
                <TableCell className="hidden lg:table-cell text-muted-foreground">{appt.time}</TableCell>
                <TableCell>
                  <AppointmentStatusBadge status={appt.status} />
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <button
                          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          aria-label={`Actions for ${appt.patient}`}
                        >
                          <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                        </button>
                      }
                    />
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem render={<Link href={`/admin/appointments/${appt.id}`} />}>
                        <Eye className="mr-2 h-4 w-4" /> View
                      </DropdownMenuItem>
                      <DropdownMenuItem render={<Link href={`/admin/appointments/${appt.id}/edit`} />}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onSelect={() => setDeleteId(appt.id)}
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

      <p className="text-xs text-muted-foreground">
        Showing {filtered.length} of {appointments.length} appointment{appointments.length !== 1 ? "s" : ""}
      </p>

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete appointment?"
        description="This action cannot be undone. The appointment will be permanently removed."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={() => {
          // TODO: call DELETE /api/admin/appointments/:id
          setDeleteId(null)
        }}
      />
    </>
  )
}
