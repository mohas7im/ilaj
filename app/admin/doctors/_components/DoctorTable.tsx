"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/admin/ui/table"
import { Button } from "@/components/admin/ui/button"
import { Badge } from "@/components/admin/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/admin/ui/avatar"
import { EmptyState } from "@/components/admin/ui/empty-state"
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog"
import type { Doctor } from "../_types/doctor.types"
import { doctorApiService } from "../_services/doctor.api"

type DoctorTableProps = {
  doctors: Doctor[]
}

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
}

export function DoctorTable({ doctors: initialDoctors }: DoctorTableProps) {
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    setDoctors(initialDoctors)
  }, [initialDoctors])

  const sortedDoctors = [...doctors].sort(
    (a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999)
  )

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await doctorApiService.delete(deleteId)
      setDoctors((prev) => prev.filter((d) => d.id !== deleteId))
      toast.success("Doctor deleted successfully")
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to delete doctor"
      toast.error(msg)
    } finally {
      setDeleteId(null)
    }
  }

  return (
    <div className="space-y-3">
      {sortedDoctors.length === 0 ? (
        <EmptyState
          title="No doctors found"
          description="Add a new practitioner or specialist to the clinic team."
          action={{ label: "+ Add Doctor", href: "/admin/doctors/create" }}
        />
      ) : (
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-28 text-center">Display Order</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead className="hidden sm:table-cell">Designation</TableHead>
                <TableHead className="hidden md:table-cell">Specialization</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedDoctors.map((doctor) => {
                const isActive = doctor.isActive !== false
                return (
                  <TableRow key={doctor.id} className="[&>td]:py-4">
                    <TableCell className="text-sm font-medium text-foreground text-center select-none">
                      {doctor.displayOrder ?? 1}
                    </TableCell>
                    <TableCell className="whitespace-normal">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="h-9 w-9 shrink-0 rounded-md">
                          {doctor.image ? (
                            <AvatarImage
                              src={doctor.image}
                              alt={doctor.imageAlt || doctor.name}
                              className="object-cover"
                            />
                          ) : null}
                          <AvatarFallback className="text-xs rounded-md bg-muted text-muted-foreground font-medium">
                            {initials(doctor.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{doctor.name}</span>
                          {doctor.bio && (
                            <span className="text-xs text-muted-foreground sm:hidden leading-relaxed mt-0.5">
                              {doctor.bio}
                            </span>
                          )}
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
                    <TableCell>
                      <Badge variant={isActive ? "default" : "secondary"}>
                        {isActive ? "Active" : "Inactive"}
                      </Badge>
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
                )
              })}
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
