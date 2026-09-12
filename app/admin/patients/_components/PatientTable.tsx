"use client"

import { useState } from "react"
import Link from "next/link"
import { Pencil, Trash2 } from "lucide-react"
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/admin/ui/table"
import { Button } from "@/components/admin/ui/button"
import { EmptyState } from "@/components/admin/EmptyState"
import { ConfirmDialog } from "@/components/admin/ConfirmDialog"
import type { Patient } from "../_types/patient.types"
import type { PatientFilterState } from "./PatientFilters"

type PatientTableProps = {
  patients: Patient[]
  filters?: PatientFilterState
}

export function PatientTable({ patients: initialPatients, filters }: PatientTableProps) {
  const [patients, setPatients] = useState<Patient[]>(initialPatients)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filtered = patients.filter((p) => {
    if (filters) {
      const q = filters.search.toLowerCase().trim()
      return (
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.phone?.toLowerCase().includes(q) ?? false) ||
        (p.email?.toLowerCase().includes(q) ?? false)
      )
    }
    return true
  })

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await fetch(`/api/patients/${deleteId}`, { method: "DELETE" })
      } catch {
        // Fallback
      }
      setPatients((prev) => prev.filter((p) => p.id !== deleteId))
      setDeleteId(null)
    }
  }

  return (
    <div className="space-y-3">
      {filtered.length === 0 ? (
        <EmptyState
          title="No patients found"
          description="Try adjusting your search or register a new patient."
          action={{ label: "Add Patient", href: "/admin/patients/create" }}
        />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead className="hidden sm:table-cell">Phone</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden lg:table-cell">Registered</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{patient.name}</span>
                      <span className="text-xs text-muted-foreground sm:hidden">
                        {patient.phone}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                    {patient.phone || "—"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {patient.email || "—"}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                    {patient.createdAt ? new Date(patient.createdAt).toLocaleDateString() : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="outline"
                        size="icon-sm"
                        title="Edit patient"
                        aria-label={`Edit ${patient.name}`}
                        render={<Link href={`/admin/patients/${patient.id}/edit`} />}
                      >
                        <Pencil className="h-4 w-4" aria-hidden="true" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon-sm"
                        title="Delete patient"
                        aria-label={`Delete ${patient.name}`}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
                        onClick={() => setDeleteId(patient.id)}
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
        title="Remove patient record?"
        description="This will permanently delete this patient record and history."
        confirmLabel="Remove"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  )
}
