"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Star, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/admin/ui/table"
import { Button } from "@/components/admin/ui/button"
import { Badge } from "@/components/admin/ui/badge"
import { EmptyState } from "@/components/admin/ui/empty-state"
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog"
import type { Testimonial } from "../_types/testimonial.types"
import type { TestimonialFilterState } from "./TestimonialFilters"
import { testimonialApiService } from "../_services/testimonial.api"

type TestimonialTableProps = {
  testimonials: Testimonial[]
  filters?: TestimonialFilterState
}

export function TestimonialTable({ testimonials: initialTestimonials, filters }: TestimonialTableProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    setTestimonials(initialTestimonials)
  }, [initialTestimonials])

  const filtered = testimonials.filter((t) => {
    if (filters) {
      const q = filters.search.toLowerCase().trim()
      const matchesQuery =
        !q ||
        t.patientName.toLowerCase().includes(q) ||
        t.treatment.toLowerCase().includes(q) ||
        t.review.toLowerCase().includes(q)

      let matchesRating = true
      if (filters.rating === "5") matchesRating = t.rating >= 5
      else if (filters.rating === "4") matchesRating = t.rating >= 4
      else if (filters.rating === "3") matchesRating = t.rating >= 3

      return matchesQuery && matchesRating
    }
    return true
  })

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      await testimonialApiService.delete(deleteId)
      setTestimonials((prev) => prev.filter((t) => t.id !== deleteId))
      toast.success("Testimonial deleted successfully")
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to delete testimonial"
      toast.error(msg)
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  return (
    <div className="space-y-4">
      {filtered.length === 0 ? (
        <EmptyState
          title="No testimonials found"
          description="Try adjusting your search or add a new patient testimonial."
          action={{ label: "Add Testimonial", href: "/admin/testimonials/create" }}
        />
      ) : (
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead className="hidden sm:table-cell">Treatment</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="min-w-[280px]">Review</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id} className="[&>td]:py-5 [&>td]:align-top">
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium text-sm">{item.patientName}</span>
                      <span className="text-xs text-muted-foreground sm:hidden">{item.treatment}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm">{item.treatment}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-red-500 text-red-500" aria-hidden="true" />
                      <span className="text-sm font-semibold">{item.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground min-w-[280px] max-w-md lg:max-w-xl whitespace-normal leading-relaxed">
                    <p className="leading-relaxed whitespace-normal break-words">&ldquo;{item.review}&rdquo;</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.status === "published" ? "default" : "secondary"}>
                      {item.status === "published" ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="outline"
                        size="icon-sm"
                        title="Edit testimonial"
                        aria-label={`Edit testimonial for ${item.patientName}`}
                        render={<Link href={`/admin/testimonials/${item.id}/edit`} />}
                      >
                        <Pencil className="h-4 w-4" aria-hidden="true" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon-sm"
                        title="Delete testimonial"
                        aria-label={`Delete testimonial for ${item.patientName}`}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
                        onClick={() => setDeleteId(item.id)}
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
        onOpenChange={(open) => !open && !isDeleting && setDeleteId(null)}
        title="Delete testimonial?"
        description="This will permanently delete this patient review. This action cannot be undone."
        confirmLabel={isDeleting ? "Deleting..." : "Delete"}
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  )
}
