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
import { Badge } from "@/components/admin/ui/badge"
import { Avatar, AvatarFallback } from "@/components/admin/ui/avatar"
import { Input } from "@/components/admin/ui/input"
import { Search } from "lucide-react"
import { EmptyState } from "@/components/admin/common/EmptyState"
import { ConfirmDialog } from "@/components/admin/common/ConfirmDialog"
import { DOCTOR_STATUS_CONFIG } from "../config"
import type { Doctor } from "../types"

type DoctorTableProps = {
  doctors: Doctor[]
}

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
}

export function DoctorTable({ doctors }: DoctorTableProps) {
  const [search, setSearch] = useState("")
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filtered = doctors.filter((d) => {
    const q = search.toLowerCase()
    return (
      !q ||
      d.name.toLowerCase().includes(q) ||
      d.specialization.toLowerCase().includes(q) ||
      d.email.toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-3">
      <div className="relative max-w-xs">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search doctors..."
          className="pl-8 h-9"
          aria-label="Search doctors"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No doctors found"
          description="Adjust your search or add a new doctor."
          action={{ label: "Add Doctor", href: "/admin/doctors/new" }}
        />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Doctor</TableHead>
                <TableHead className="hidden sm:table-cell">Specialization</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden lg:table-cell">Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-8"><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((doctor) => {
                const { label, variant } = DOCTOR_STATUS_CONFIG[doctor.status]
                return (
                  <TableRow key={doctor.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7 shrink-0">
                          <AvatarFallback className="text-xs">{initials(doctor.name)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{doctor.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">{doctor.specialization}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">{doctor.email}</TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground">{doctor.phone}</TableCell>
                    <TableCell>
                      <Badge variant={variant} aria-label={`Status: ${label}`}>{label}</Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <button
                              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                              aria-label={`Actions for ${doctor.name}`}
                            >
                              <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                            </button>
                          }
                        />
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem render={<Link href={`/admin/doctors/${doctor.id}`} />}>
                            <Eye className="mr-2 h-4 w-4" /> View
                          </DropdownMenuItem>
                          <DropdownMenuItem render={<Link href={`/admin/doctors/${doctor.id}/edit`} />}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onSelect={() => setDeleteId(doctor.id)}
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
      )}

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Remove doctor?"
        description="This will permanently remove the doctor's profile. This action cannot be undone."
        confirmLabel="Remove"
        variant="destructive"
        onConfirm={() => {
          // TODO: call DELETE /api/admin/doctors/:id
          setDeleteId(null)
        }}
      />
    </div>
  )
}
