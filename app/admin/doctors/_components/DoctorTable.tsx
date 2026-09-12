"use client"

import { useState } from "react"
import Link from "next/link"
import { Pencil, Trash2 } from "lucide-react"
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/admin/ui/table"
import { Button } from "@/components/admin/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/admin/ui/avatar"
import { EmptyState } from "@/components/admin/EmptyState"
import { ConfirmDialog } from "@/components/admin/ConfirmDialog"
import type { Doctor } from "../_types/doctor.types"
import type { DoctorFilterState } from "./DoctorFilters"

type DoctorTableProps = {
  doctors: Doctor[]
  filters?: DoctorFilterState
}

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
}

export function DoctorTable({ doctors: initialDoctors, filters }: DoctorTableProps) {
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filtered = doctors.filter((d) => {
    if (filters) {
      const q = filters.search.toLowerCase().trim()
      const matchesName = !q || d.name.toLowerCase().includes(q)
      const matchesSpec =
        filters.specialization === "all" ||
        d.specialization.toLowerCase() === filters.specialization.toLowerCase()
      return matchesName && matchesSpec
    }
    return true
  })

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await fetch(`/api/doctors/${deleteId}`, { method: "DELETE" })
      } catch {
        // Fallback
      }
      setDoctors((prev) => prev.filter((d) => d.id !== deleteId))
      setDeleteId(null)
    }
  }

  return (
    <div className="space-y-3">
      {filtered.length === 0 ? (
        <EmptyState
          title="No doctors found"
          description="Adjust your search or add a new doctor."
          action={{ label: "Add Doctor", href: "/admin/doctors/create" }}
        />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Doctor</TableHead>
                <TableHead className="hidden sm:table-cell">Designation</TableHead>
                <TableHead className="hidden md:table-cell">Specialization</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((doctor) => (
                <TableRow key={doctor.id}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-9 w-9 shrink-0">
                        {doctor.image ? (
                          <AvatarImage src={doctor.image} alt={doctor.name} />
                        ) : null}
                        <AvatarFallback className="text-xs">{initials(doctor.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{doctor.name}</span>
                        <span className="text-xs text-muted-foreground sm:hidden">
                          {doctor.designation} • {doctor.specialization}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span className="inline-flex items-center rounded-md bg-secondary/80 px-2.5 py-0.5 text-xs font-medium text-secondary-foreground border border-border/50">
                      {doctor.designation}
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {doctor.specialization}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="outline"
                        size="icon-sm"
                        title="Edit doctor"
                        aria-label={`Edit ${doctor.name}`}
                        render={<Link href={`/admin/doctors/${doctor.id}/edit`} />}
                      >
                        <Pencil className="h-4 w-4" aria-hidden="true" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon-sm"
                        title="Delete doctor"
                        aria-label={`Delete ${doctor.name}`}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
                        onClick={() => setDeleteId(doctor.id)}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Remove doctor?"
        description="This will permanently remove the doctor's profile. This action cannot be undone."
        confirmLabel="Remove"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  )
}
