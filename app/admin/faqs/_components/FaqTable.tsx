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
import { EmptyState } from "@/components/admin/ui/empty-state"
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog"
import type { Faq } from "@/domain/faq/faq.types"
import { getApiErrorMessage } from "@/lib/api/errors"
import type { FaqFilterState } from "./FaqFilters"
import { faqApiService } from "../_services/faq.api"

type FaqTableProps = {
  faqs: Faq[]
  filters: FaqFilterState
}

export function FaqTable({ faqs: initialFaqs, filters }: FaqTableProps) {
  const [faqs, setFaqs] = useState<Faq[]>(initialFaqs)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    setFaqs(initialFaqs)
  }, [initialFaqs])

  const q = filters.search.toLowerCase().trim()
  const filtered = faqs.filter((f) => {
    return !q || f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)
  })

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      await faqApiService.delete(deleteId)
      setFaqs((prev) => prev.filter((f) => f.id !== deleteId))
      toast.success("FAQ deleted successfully")
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to delete FAQ"))
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  return (
    <div className="space-y-4">
      {filtered.length === 0 ? (
        <EmptyState
          title="No FAQs found"
          description="Try adjusting your search or add a new question."
          action={{ label: "Add FAQ", href: "/admin/faqs/create" }}
        />
      ) : (
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[280px]">Question</TableHead>
                <TableHead className="hidden sm:table-cell">Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id} className="[&>td]:py-4 [&>td]:align-top">
                  <TableCell className="min-w-[280px] max-w-md lg:max-w-xl whitespace-normal">
                    <p className="font-medium text-sm break-words">{item.question}</p>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2 break-words">
                      {item.answer}
                    </p>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm">{item.displayOrder}</TableCell>
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
                        title="Edit FAQ"
                        aria-label={`Edit FAQ: ${item.question}`}
                        render={<Link href={`/admin/faqs/${item.id}/edit`} />}
                      >
                        <Pencil aria-hidden="true" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon-sm"
                        title="Delete FAQ"
                        aria-label={`Delete FAQ: ${item.question}`}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
                        onClick={() => setDeleteId(item.id)}
                      >
                        <Trash2 aria-hidden="true" />
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
        title="Delete FAQ?"
        description="This will permanently delete this question and its answer. This action cannot be undone."
        confirmLabel={isDeleting ? "Deleting..." : "Delete"}
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  )
}
