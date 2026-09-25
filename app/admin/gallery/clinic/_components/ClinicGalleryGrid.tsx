"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Pencil, Trash2, ImageIcon } from "lucide-react"
import { toast } from "sonner"
import { Card, CardHeader, CardTitle } from "@/components/admin/ui/card"
import { Button } from "@/components/admin/ui/button"
import { ConfirmDialog } from "@/components/admin/ConfirmDialog"
import { EmptyState } from "@/components/admin/EmptyState"
import type { ClinicPhoto } from "@/domain/clinic-photo/clinic-photo.types"
import { clinicPhotoApiService } from "../_services/clinic-photo.api"

type ClinicGalleryGridProps = {
  initialPhotos: ClinicPhoto[]
}

export function ClinicGalleryGrid({ initialPhotos }: ClinicGalleryGridProps) {
  const [photos, setPhotos] = useState<ClinicPhoto[]>(initialPhotos)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    setPhotos(initialPhotos)
  }, [initialPhotos])

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      await clinicPhotoApiService.delete(deleteId)
      setPhotos((prev) => prev.filter((p) => p.id !== deleteId))
      toast.success("Clinic photo deleted successfully")
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to delete clinic photo"
      toast.error(msg)
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  return (
    <>
      {photos.length === 0 ? (
        <EmptyState
          title="No clinic photos found"
          description="Upload photos of your clinic premises and treatment rooms."
          action={{ label: "Add Photo", href: "/admin/gallery/clinic/create" }}
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
                    alt={item.alt || item.heading}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1.5 text-muted-foreground">
                    <ImageIcon className="h-8 w-8 opacity-40" />
                    <span className="text-xs">No image</span>
                  </div>
                )}
                {item.displayOrder !== undefined && (
                  <span className="absolute top-2 left-2 rounded-md bg-black/60 backdrop-blur-xs px-2 py-0.5 text-[10px] font-semibold text-white">
                    Order: {item.displayOrder}
                  </span>
                )}
              </div>

              {/* Heading & Actions */}
              <CardHeader className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col">
                    <CardTitle className="text-base font-semibold leading-snug">
                      {item.heading}
                    </CardTitle>
                    {item.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="outline"
                      size="icon-sm"
                      title="Edit"
                      aria-label={`Edit ${item.heading}`}
                      render={<Link href={`/admin/gallery/clinic/${item.id}/edit`} />}
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
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && !isDeleting && setDeleteId(null)}
        title="Delete clinic photo?"
        description="This will permanently remove this photo from the clinic gallery. This action cannot be undone."
        confirmLabel={isDeleting ? "Deleting..." : "Delete"}
        variant="destructive"
        onConfirm={handleDelete}
      />
    </>
  )
}
