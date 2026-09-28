"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Pencil, Trash2, ImageIcon } from "lucide-react"
import { toast } from "sonner"
import { Card, CardHeader, CardTitle } from "@/components/admin/ui/card"
import { Button } from "@/components/admin/ui/button"
import { ConfirmDialog } from "@/components/admin/ConfirmDialog"
import { EmptyState } from "@/components/admin/EmptyState"
import { LoadingState } from "@/components/admin/ui/loading-state"
import type { PatientCase } from "@/domain/patient-case/patient-case.types"
import { patientCaseApiService } from "../_services/patient-case.api"
import { getApiErrorMessage } from "@/lib/api/errors"

export function PatientGalleryGrid() {
  const [cases, setCases] = useState<PatientCase[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    patientCaseApiService
      .getAll()
      .then(setCases)
      .catch((error) => toast.error(getApiErrorMessage(error, "Failed to load patient cases")))
      .finally(() => setIsLoading(false))
  }, [])

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      await patientCaseApiService.delete(deleteId)
      setCases((prev) => prev.filter((c) => c.id !== deleteId))
      toast.success("Patient case deleted successfully")
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to delete patient case"
      toast.error(msg)
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  return (
    <>
      {isLoading ? (
        <LoadingState spinner label="Loading patient cases..." />
      ) : cases.length === 0 ? (
        <EmptyState
          title="No patient cases found"
          description="Start showcasing smile transformations by adding your first before & after case."
          action={{ label: "Add Before & After", href: "/admin/gallery/patient/create" }}
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cases.map((item) => (
            <Card key={item.id} className="overflow-hidden flex flex-col justify-between shadow-xs">
              {/* Before & After Image Split View */}
              <div className="relative grid grid-cols-2 h-48 border-b divide-x overflow-hidden bg-muted/20">
                {/* Before Image */}
                <div className="relative flex items-center justify-center overflow-hidden">
                  {item.beforeImage ? (
                    <img
                      src={item.beforeImage}
                      alt={item.beforeAlt || `${item.heading} Before`}
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
                      alt={item.afterAlt || `${item.heading} After`}
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
                      render={<Link href={`/admin/gallery/patient/${item.id}/edit`} />}
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
        title="Delete patient case?"
        description="This will permanently remove this before & after case from the gallery. This action cannot be undone."
        confirmLabel="Delete"
        isLoading={isDeleting}
        variant="destructive"
        onConfirm={handleDelete}
      />
    </>
  )
}
