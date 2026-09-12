"use client"

import { useState, useRef } from "react"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/admin/ui/card"
import { Button } from "@/components/admin/ui/button"
import { Input } from "@/components/admin/ui/input"
import { Label } from "@/components/admin/ui/label"
import { Textarea } from "@/components/admin/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/admin/ui/dialog"
import { ConfirmDialog } from "@/components/admin/ConfirmDialog"
import { EmptyState } from "@/components/admin/EmptyState"
import { Pencil, Trash2, Upload, ImageIcon, Plus } from "lucide-react"

type PatientCase = {
  id: string
  heading: string
  description: string
  beforeImage: string
  afterImage: string
}

const INITIAL_CASES: PatientCase[] = [
  {
    id: "1",
    heading: "Teeth Alignment & Whitening",
    description: "Full smile transformation with invisible aligners and in-office dental whitening.",
    beforeImage: "/admin/patient-before-after.jpg",
    afterImage: "/admin/patient-before-after.jpg",
  },
  {
    id: "2",
    heading: "Dental Implants & Ceramic Crown",
    description: "Replaced missing front tooth with a permanent titanium implant and natural-looking ceramic crown.",
    beforeImage: "/admin/patient-before-after.jpg",
    afterImage: "/admin/patient-before-after.jpg",
  },
  {
    id: "3",
    heading: "Porcelain Veneers Transformation",
    description: "Corrected front teeth spacing, minor discoloration, and uneven edges for a harmonious smile.",
    beforeImage: "/admin/patient-before-after.jpg",
    afterImage: "/admin/patient-before-after.jpg",
  },
]

export default function PatientGalleryPage() {
  const [cases, setCases] = useState<PatientCase[]>(INITIAL_CASES)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const [form, setForm] = useState({
    heading: "",
    description: "",
    beforeImage: "",
    afterImage: "",
  })

  const beforeFileRef = useRef<HTMLInputElement>(null)
  const afterFileRef = useRef<HTMLInputElement>(null)

  const handleOpenAdd = () => {
    setEditingId(null)
    setForm({
      heading: "",
      description: "",
      beforeImage: "/admin/patient-before-after.jpg",
      afterImage: "/admin/patient-before-after.jpg",
    })
    setDialogOpen(true)
  }

  const handleOpenEdit = (item: PatientCase) => {
    setEditingId(item.id)
    setForm({
      heading: item.heading,
      description: item.description,
      beforeImage: item.beforeImage,
      afterImage: item.afterImage,
    })
    setDialogOpen(true)
  }

  const handleImageFile = (key: "beforeImage" | "afterImage", e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, [key]: reader.result as string }))
    }
    reader.readAsDataURL(file)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      setCases((prev) =>
        prev.map((c) => (c.id === editingId ? { ...c, ...form } : c))
      )
    } else {
      const newCase: PatientCase = {
        id: Date.now().toString(),
        ...form,
      }
      setCases((prev) => [newCase, ...prev])
    }
    setDialogOpen(false)
  }

  const handleDelete = () => {
    if (deleteId) {
      setCases((prev) => prev.filter((c) => c.id !== deleteId))
      setDeleteId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header with Action */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Patient Gallery</h1>
          <p className="text-sm text-muted-foreground">
            Before &amp; after smile transformations and case studies.
          </p>
        </div>
        <Button onClick={handleOpenAdd}>
          <Plus className="mr-1.5 h-4 w-4" /> Add Before &amp; After
        </Button>
      </div>

      {/* Cases Grid */}
      {cases.length === 0 ? (
        <EmptyState
          title="No patient cases found"
          description="Start showcasing smile transformations by adding your first before & after case."
          action={{ label: "Add Case Study", href: "#", onClick: handleOpenAdd }}
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cases.map((item) => (
            <Card key={item.id} className="overflow-hidden flex flex-col justify-between shadow-xs">
              {/* Before & After Image Split View */}
              <div className="grid grid-cols-2 h-48 border-b divide-x overflow-hidden bg-muted/20">
                {/* Before Image */}
                <div className="relative flex items-center justify-center overflow-hidden">
                  {item.beforeImage ? (
                    <img
                      src={item.beforeImage}
                      alt={`${item.heading} Before`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-muted-foreground">
                      <ImageIcon className="h-6 w-6 opacity-40" />
                      <span className="text-[11px]">No image</span>
                    </div>
                  )}
                  <span className="absolute bottom-2 left-2 rounded-md bg-black/75 backdrop-blur-xs px-2 py-0.5 text-[10px] font-semibold tracking-wider text-white uppercase select-none">
                    Before
                  </span>
                </div>

                {/* After Image */}
                <div className="relative flex items-center justify-center overflow-hidden">
                  {item.afterImage ? (
                    <img
                      src={item.afterImage}
                      alt={`${item.heading} After`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-muted-foreground">
                      <ImageIcon className="h-6 w-6 opacity-40" />
                      <span className="text-[11px]">No image</span>
                    </div>
                  )}
                  <span className="absolute bottom-2 right-2 rounded-md bg-primary text-primary-foreground px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase select-none">
                    After
                  </span>
                </div>
              </div>

              {/* Heading, Description & Actions */}
              <CardHeader className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base font-semibold leading-snug">
                    {item.heading}
                  </CardTitle>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="outline"
                      size="icon-sm"
                      title="Edit"
                      aria-label={`Edit ${item.heading}`}
                      onClick={() => handleOpenEdit(item)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon-sm"
                      title="Delete"
                      aria-label={`Delete ${item.heading}`}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
                      onClick={() => setDeleteId(item.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <CardDescription className="text-xs text-muted-foreground leading-relaxed pt-1 line-clamp-3">
                  {item.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Case Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Before & After Case" : "Add Before & After Case"}
            </DialogTitle>
            <DialogDescription>
              Provide before and after photos, case heading, and description.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 pt-2">
            {/* Heading */}
            <div className="space-y-1.5">
              <Label htmlFor="heading">Heading <span className="text-destructive">*</span></Label>
              <Input
                id="heading"
                value={form.heading}
                onChange={(e) => setForm((p) => ({ ...p, heading: e.target.value }))}
                placeholder="e.g. Teeth Alignment & Whitening"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="description">Description <span className="text-destructive">*</span></Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Describe the treatment and clinical outcome..."
                rows={3}
                required
              />
            </div>

            {/* Images: Before & After */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              {/* Before Image */}
              <div className="space-y-2 p-3 rounded-lg border bg-muted/20">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                  Before Image
                </span>
                <div className="relative aspect-video w-full rounded-md border overflow-hidden bg-muted/40 flex items-center justify-center">
                  {form.beforeImage ? (
                    <img src={form.beforeImage} alt="Before preview" className="h-full w-full object-cover" />
                  ) : (
                    <ImageIcon className="h-6 w-6 text-muted-foreground/50" />
                  )}
                </div>
                <input
                  ref={beforeFileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageFile("beforeImage", e)}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => beforeFileRef.current?.click()}
                >
                  <Upload className="mr-1 h-3 w-3" /> Upload Before
                </Button>
              </div>

              {/* After Image */}
              <div className="space-y-2 p-3 rounded-lg border bg-muted/20">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary block">
                  After Image
                </span>
                <div className="relative aspect-video w-full rounded-md border overflow-hidden bg-muted/40 flex items-center justify-center">
                  {form.afterImage ? (
                    <img src={form.afterImage} alt="After preview" className="h-full w-full object-cover" />
                  ) : (
                    <ImageIcon className="h-6 w-6 text-muted-foreground/50" />
                  )}
                </div>
                <input
                  ref={afterFileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageFile("afterImage", e)}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => afterFileRef.current?.click()}
                >
                  <Upload className="mr-1 h-3 w-3" /> Upload After
                </Button>
              </div>
            </div>

            <DialogFooter className="pt-3">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingId ? "Save Changes" : "Add Case"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete patient case?"
        description="This will permanently remove this before & after case from the gallery. This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  )
}
