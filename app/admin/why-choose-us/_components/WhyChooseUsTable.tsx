"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2 } from "lucide-react"
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
import { EmptyState } from "@/components/admin/ui/empty-state"
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog"
import { PageHeader } from "@/components/admin/ui/page-header"
import type { WhyChooseUsItem } from "../_types/why-choose-us.types"

type WhyChooseUsTableProps = {
  initialItems: WhyChooseUsItem[]
}

export function WhyChooseUsTable({ initialItems }: WhyChooseUsTableProps) {
  const [items, setItems] = useState<WhyChooseUsItem[]>(() =>
    [...initialItems].sort((a, b) => a.displayOrder - b.displayOrder)
  )
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<WhyChooseUsItem | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const [form, setForm] = useState({
    title: "",
    displayOrder: 1,
  })

  const handleOpenAdd = () => {
    const nextOrder =
      items.length > 0 ? Math.max(...items.map((i) => i.displayOrder)) + 1 : 1
    setEditingItem(null)
    setForm({ title: "", displayOrder: nextOrder })
    setDialogOpen(true)
  }

  const handleOpenEdit = (item: WhyChooseUsItem) => {
    setEditingItem(item)
    setForm({
      title: item.title,
      displayOrder: item.displayOrder,
    })
    setDialogOpen(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedTitle = form.title.trim()
    if (!trimmedTitle) return

    const orderNum = Number(form.displayOrder) || 1

    if (editingItem) {
      setItems((prev) =>
        prev
          .map((it) =>
            it.id === editingItem.id
              ? { ...it, title: trimmedTitle, displayOrder: orderNum }
              : it
          )
          .sort((a, b) => a.displayOrder - b.displayOrder)
      )
    } else {
      const newItem: WhyChooseUsItem = {
        id: Date.now().toString(),
        title: trimmedTitle,
        displayOrder: orderNum,
      }
      setItems((prev) =>
        [...prev, newItem].sort((a, b) => a.displayOrder - b.displayOrder)
      )
    }
    setDialogOpen(false)
  }

  const handleDelete = () => {
    if (deleteId) {
      setItems((prev) => prev.filter((it) => it.id !== deleteId))
      setDeleteId(null)
    }
  }


  return (
    <div className="space-y-6">
      <PageHeader
        title="Why Choose Us"
        description="Manage the 5 core highlight points displayed on the website."
      >
        <Button onClick={handleOpenAdd}>
          <Plus className="mr-1.5 h-4 w-4" /> Add Point
        </Button>
      </PageHeader>

      {items.length === 0 ? (
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
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="text-sm font-medium text-foreground text-center select-none">
                    {item.displayOrder}
                  </TableCell>
                  <TableCell className="font-medium text-sm">
                    {item.title}
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
                ? "Update the title and display order of this highlight point."
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
                placeholder="e.g. Experienced & Qualified Doctors"
                required
                autoFocus
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
                placeholder="e.g. 1"
                required
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
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
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  )
}
