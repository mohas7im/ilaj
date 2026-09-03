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
import { Input } from "@/components/admin/ui/input"
import { Search } from "lucide-react"
import { EmptyState } from "@/components/admin/common/EmptyState"
import { ConfirmDialog } from "@/components/admin/common/ConfirmDialog"
import { SERVICE_STATUS_CONFIG, formatDuration, formatPrice } from "../config"
import type { Service } from "../types"

type ServiceTableProps = { services: Service[] }

export function ServiceTable({ services }: ServiceTableProps) {
  const [search, setSearch] = useState("")
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filtered = services.filter((s) => {
    const q = search.toLowerCase()
    return !q || s.name.toLowerCase().includes(q)
  })

  return (
    <div className="space-y-3">
      <div className="relative max-w-xs">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search services..."
          className="pl-8 h-9"
          aria-label="Search services"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No services found"
          description="Adjust your search or add a new service."
          action={{ label: "Add Service", href: "/admin/services/new" }}
        />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead className="hidden sm:table-cell">Duration</TableHead>
                <TableHead className="hidden sm:table-cell">Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-8"><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((svc) => {
                const { label, variant } = SERVICE_STATUS_CONFIG[svc.status]
                return (
                  <TableRow key={svc.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{svc.name}</p>
                        {svc.description && (
                          <p className="text-xs text-muted-foreground line-clamp-1">{svc.description}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">
                      {formatDuration(svc.duration)}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">
                      {formatPrice(svc.price)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={variant}>{label}</Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <button
                              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                              aria-label={`Actions for ${svc.name}`}
                            >
                              <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                            </button>
                          }
                        />
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem render={<Link href={`/admin/services/${svc.id}`} />}>
                            <Eye className="mr-2 h-4 w-4" /> View
                          </DropdownMenuItem>
                          <DropdownMenuItem render={<Link href={`/admin/services/${svc.id}/edit`} />}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onSelect={() => setDeleteId(svc.id)}
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
        title="Delete service?"
        description="This will permanently delete the service. Existing appointments using this service will not be affected."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={() => {
          // TODO: call DELETE /api/admin/services/:id
          setDeleteId(null)
        }}
      />
    </div>
  )
}
