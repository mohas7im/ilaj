"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react"
import { toast } from "sonner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/admin/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/admin/ui/dialog"
import { Button } from "@/components/admin/ui/button"
import { Input } from "@/components/admin/ui/input"
import { Label } from "@/components/admin/ui/label"
import { Textarea } from "@/components/admin/ui/textarea"
import { EmptyState } from "@/components/admin/ui/empty-state"
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog"
import { LoadingState } from "@/components/admin/ui/loading-state"
import { PageHeader } from "@/components/admin/ui/page-header"
import { whyChooseUsApiService } from "../_services/why-choose-us.api"
import { getApiErrorMessage } from "@/lib/api/errors"
import type { WhyChooseUsItem } from "@/domain/why-choose-us/why-choose-us.types"

export function WhyChooseUsTable() {
  const router = useRouter()
  const [items, setItems] = useState<WhyChooseUsItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<WhyChooseUsItem | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const [form, setForm] = useState({
    title: "",
    description: "",
    displayOrder: 1,
  })

  useEffect(() => {
    whyChooseUsApiService
      .getAll()
      .then((data) => setItems([...data].sort((a, b) => a.displayOrder - b.displayOrder)))
      .catch((error) => toast.error(getApiErrorMessage(error, "Failed to load highlight points")))
      .finally(() => setIsLoading(false))
  }, [])

  const handleOpenAdd = () => {
    const nextOrder =
      items.length > 0 ? Math.max(...items.map((i) => i.displayOrder)) + 1 : 1
    setEditingItem(null)
    setForm({ title: "", description: "", displayOrder: nextOrder })
    setDialogOpen(true)
  }

  const handleOpenEdit = (item: WhyChooseUsItem) => {
    setEditingItem(item)
    setForm({
      title: item.title,
      description: item.description ?? "",
      displayOrder: item.displayOrder,
    })
    setDialogOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedTitle = form.title.trim()
    if (!trimmedTitle) {
      toast.error("Please enter a title")
      return
    }

    const orderNum = Number(form.displayOrder) || 1
    const trimmedDesc = form.description.trim() || undefined

    setIsSaving(true)
    try {
      if (editingItem) {
        const updated = await whyChooseUsApiService.update(editingItem.id, {
          title: trimmedTitle,
          description: trimmedDesc,
          displayOrder: orderNum,
        })
        setItems((prev) =>
          prev
            .map((it) => (it.id === editingItem.id ? updated : it))
            .sort((a, b) => a.displayOrder - b.displayOrder)
        )
        toast.success("Highlight point updated successfully")
      } else {
        const created = await whyChooseUsApiService.create({
          title: trimmedTitle,
          description: trimmedDesc,
          displayOrder: orderNum,
        })
        setItems((prev) =>
          [...prev, created].sort((a, b) => a.displayOrder - b.displayOrder)
        )
        toast.success("Highlight point added successfully")
      }
      setDialogOpen(false)
      router.refresh()
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to save point"
      toast.error(msg)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      await whyChooseUsApiService.delete(deleteId)
      setItems((prev) => prev.filter((it) => it.id !== deleteId))
      toast.success("Highlight point deleted successfully")
      setDeleteId(null)
      router.refresh()
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to delete point"
      toast.error(msg)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Why Choose Us"
        description="Manage the core highlight points displayed on the website."
      >
        <Button onClick={handleOpenAdd}>
          <Plus className="mr-1.5 h-4 w-4" /> Add Point
        </Button>
      </PageHeader>

      {isLoading ? (
        <LoadingState spinner label="Loading highlight points..." />
      ) : items.length === 0 ? (
        <EmptyState
          title="No points found"
          description="Add highlight points to display in the Why Choose Us section."
          action={{ label: "Add Point", onClick: handleOpenAdd }}
        />
      ) : (
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-32 text-center">Display Order</TableHead>
                <TableHead>Highlight Point</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="text-sm font-medium text-foreground text-center select-none">
                    {item.displayOrder}
                  </TableCell>
                  <TableCell className="font-medium text-sm">
                    {item.title}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground min-w-[240px] max-w-md lg:max-w-xl whitespace-normal leading-relaxed break-words">
                    {item.description || "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="outline"
                        size="icon-sm"
                        title="Edit point"
                        aria-label={`Edit ${item.title}`}
                        onClick={() => handleOpenEdit(item)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon-sm"
                        title="Delete point"
                        aria-label={`Delete ${item.title}`}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
                        onClick={() => setDeleteId(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add / Edit Point Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Edit Feature Point" : "Add Feature Point"}
            </DialogTitle>
            <DialogDescription>
              {editingItem
                ? "Update the title, description, and display order of this highlight point."
                : "Add a new highlight point to display in the Why Choose Us section."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <Label htmlFor="point-title">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="point-title"
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                required
                autoFocus
                disabled={isSaving}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="point-description">Description (optional)</Label>
              <Textarea
                id="point-description"
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                rows={3}
                disabled={isSaving}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="display-order">
                Display Order <span className="text-destructive">*</span>
              </Label>
              <Input
                id="display-order"
                type="number"
                min={1}
                value={form.displayOrder}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    displayOrder: parseInt(e.target.value, 10) || 1,
                  }))
                }
                required
                disabled={isSaving}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
                {editingItem ? "Save Changes" : "Add Point"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete point?"
        description="Are you sure you want to remove this highlight point? This action cannot be undone."
        confirmLabel="Delete"
        isLoading={isDeleting}
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  )
}
