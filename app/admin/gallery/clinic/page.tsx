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

type ClinicPhoto = {
  id: string
  heading: string
  description: string
  image: string
}

const INITIAL_PHOTOS: ClinicPhoto[] = [
  {
    id: "1",
    heading: "Treatment Suite & Dental Unit",
    description: "Modern, ergonomic dental chair with digital monitoring and panoramic window view.",
    image: "/admin/clinic-gallery-room.jpg",
  },
  {
    id: "2",
    heading: "Reception & Architectural Lounge",
    description: "Spacious, comfortable patient waiting lounge with natural slate and glass architecture.",
    image: "/admin/login-showcase.jpg",
  },
  {
    id: "3",
    heading: "Consultation & Smile Design Studio",
    description: "Dedicated digital imaging and treatment planning consultation area.",
    image: "/admin/clinic-gallery-room.jpg",
  },
]

export default function ClinicGalleryPage() {
  const [photos, setPhotos] = useState<ClinicPhoto[]>(INITIAL_PHOTOS)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const [form, setForm] = useState({
    heading: "",
    description: "",
    image: "",
  })

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleOpenAdd = () => {
    setEditingId(null)
    setForm({
      heading: "",
      description: "",
      image: "/admin/clinic-gallery-room.jpg",
    })
    setDialogOpen(true)
  }

  const handleOpenEdit = (item: ClinicPhoto) => {
    setEditingId(item.id)
    setForm({
      heading: item.heading,
      description: item.description,
      image: item.image,
    })
    setDialogOpen(true)
  }

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, image: reader.result as string }))
    }
    reader.readAsDataURL(file)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      setPhotos((prev) =>
        prev.map((p) => (p.id === editingId ? { ...p, ...form } : p))
      )
    } else {
      const newPhoto: ClinicPhoto = {
        id: Date.now().toString(),
        ...form,
      }
      setPhotos((prev) => [newPhoto, ...prev])
    }
    setDialogOpen(false)
  }

  const handleDelete = () => {
    if (deleteId) {
      setPhotos((prev) => prev.filter((p) => p.id !== deleteId))
      setDeleteId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Clinic Gallery</h1>
          <p className="text-sm text-muted-foreground">
            Showcase clinic premises, facilities, and treatment rooms.
          </p>
        </div>
        <Button onClick={handleOpenAdd}>
          <Plus className="mr-1.5 h-4 w-4" /> Add Photo
        </Button>
      </div>

      {/* Photos Grid */}
      {photos.length === 0 ? (
        <EmptyState
          title="No clinic photos found"
          description="Upload photos of your clinic premises and treatment rooms."
          action={{ label: "Add Photo", href: "#", onClick: handleOpenAdd }}
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((item) => (
            <Card key={item.id} className="overflow-hidden flex flex-col justify-between shadow-xs">
              {/* Photo Display */}
              <div className="relative h-48 w-full border-b overflow-hidden bg-muted/20 flex items-center justify-center">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.heading}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1.5 text-muted-foreground">
                    <ImageIcon className="h-8 w-8 opacity-40" />
                    <span className="text-xs">No image</span>
                  </div>
                )}
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

      {/* Add / Edit Photo Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Clinic Photo" : "Add Clinic Photo"}
            </DialogTitle>
            <DialogDescription>
              Provide photo, heading, and description.
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
                placeholder="e.g. Treatment Suite & Dental Unit"
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
                placeholder="Brief description of the room or equipment..."
                rows={3}
                required
              />
            </div>

            {/* Photo Upload */}
            <div className="space-y-2 p-3 rounded-lg border bg-muted/20">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                Photo
              </span>
              <div className="relative aspect-video w-full rounded-md border overflow-hidden bg-muted/40 flex items-center justify-center">
                {form.image ? (
                  <img src={form.image} alt="Clinic photo preview" className="h-full w-full object-cover" />
                ) : (
                  <ImageIcon className="h-7 w-7 text-muted-foreground/50" />
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageFile}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mr-1 h-3 w-3" /> Upload Photo
              </Button>
            </div>

            <DialogFooter className="pt-3">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingId ? "Save Changes" : "Add Photo"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete clinic photo?"
        description="This will permanently remove this photo from the clinic gallery. This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  )
}
