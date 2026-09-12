"use client"

import { useState } from "react"
import Link from "next/link"
import { Pencil, Trash2 } from "lucide-react"
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/admin/ui/table"
import { Button } from "@/components/admin/ui/button"
import { Badge } from "@/components/admin/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/admin/ui/avatar"
import { EmptyState } from "@/components/admin/ui/empty-state"
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog"
import { cn } from "@/lib/utils"
import { SERVICE_STATUS_CONFIG } from "../_services/service.service"
import type { Service } from "../_types/service.types"
import type { ServiceFilterState } from "./ServiceFilters"

type ServiceTableProps = {
  services: Service[]
  filters?: ServiceFilterState
}

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
}

export function ServiceTable({ services: initialServices, filters }: ServiceTableProps) {
  const [services, setServices] = useState<Service[]>(initialServices)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filtered = services
    .filter((s) => {
      if (filters) {
        const q = filters.search.toLowerCase().trim()
        const matchesQuery =
          !q ||
          s.name.toLowerCase().includes(q) ||
          (s.description?.toLowerCase().includes(q) ?? false)
        const matchesStatus =
          filters.status === "all" || s.status === filters.status
        return matchesQuery && matchesStatus
      }
      return true
    })
    .sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999))

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await fetch(`/api/services/${deleteId}`, { method: "DELETE" })
      } catch {}
      setServices((prev) => prev.filter((s) => s.id !== deleteId))
      setDeleteId(null)
    }
  }

  return (
    <div className="space-y-3">
      {filtered.length === 0 ? (
        <EmptyState
          title="No services found"
          description="Adjust your search or add a new service."
          action={{ label: "Add Service", href: "/admin/services/create" }}
        />
      ) : (
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-32 text-center">Display Order</TableHead>
                <TableHead>Service</TableHead>
                <TableHead className="hidden sm:table-cell">Description</TableHead>
                <TableHead className="hidden md:table-cell">Home Page</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((svc) => {
                const { label, variant } = SERVICE_STATUS_CONFIG[svc.status]
                return (
                  <TableRow key={svc.id} className="[&>td]:py-4">
                    <TableCell className="text-sm font-medium text-foreground text-center select-none">
                      {svc.displayOrder ?? 1}
                    </TableCell>
                    <TableCell className="whitespace-normal">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="h-9 w-9 shrink-0 rounded-md">
                          {svc.image ? (
                            <AvatarImage
                              src={svc.image}
                              alt={svc.name}
                              className="object-cover"
                            />
                          ) : null}
                          <AvatarFallback className="text-xs rounded-md bg-muted text-muted-foreground font-medium">
                            {initials(svc.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{svc.name}</span>
                          {svc.description && (
                            <span className="text-xs text-muted-foreground sm:hidden leading-relaxed mt-0.5">
                              {svc.description}
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground max-w-md lg:max-w-xl whitespace-normal leading-relaxed">
                      <p className="leading-relaxed">{svc.description || "—"}</p>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
                          svc.showInHomePage
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {svc.showInHomePage ? "Yes" : "No"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={variant}>{label}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="outline"
                          size="icon-sm"
                          title="Edit service"
                          aria-label={`Edit ${svc.name}`}
                          render={<Link href={`/admin/services/${svc.id}/edit`} />}
                        >
                          <Pencil className="h-4 w-4" aria-hidden="true" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon-sm"
                          title="Delete service"
                          aria-label={`Delete ${svc.name}`}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
                          onClick={() => setDeleteId(svc.id)}
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
        title="Delete service?"
        description="This will permanently delete the service. Existing records will not be affected."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  )
}
