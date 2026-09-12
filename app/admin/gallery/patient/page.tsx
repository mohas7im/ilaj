"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Pencil, Trash2, ImageIcon } from "lucide-react"
import { Card, CardHeader, CardTitle } from "@/components/admin/ui/card"
import { Button } from "@/components/admin/ui/button"
import { ConfirmDialog } from "@/components/admin/ConfirmDialog"
import { EmptyState } from "@/components/admin/EmptyState"
import { PageHeader } from "@/components/admin/PageHeader"
import { INITIAL_PATIENT_CASES } from "./_services/patient-case.service"
import type { PatientCase } from "./_types/patient-case.types"

export default function PatientGalleryPage() {
  const [cases, setCases] = useState<PatientCase[]>(INITIAL_PATIENT_CASES)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Sync with API on mount / navigation
  useEffect(() => {
    let isMounted = true
    async function fetchCases() {
      try {
        const res = await fetch("/api/gallery/patient")
        if (res.ok) {
          const data = await res.json()
          if (isMounted && Array.isArray(data)) {
            setCases(data)
          }
        }
      } catch {
        // Fallback to initial state
      }
    }
    fetchCases()
    return () => {
      isMounted = false
    }
  }, [])

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      await fetch(`/api/gallery/patient/${deleteId}`, { method: "DELETE" })
      setCases((prev) => prev.filter((c) => c.id !== deleteId))
    } catch {
      // Fallback
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Patient Gallery"
        description="Before & after smile transformations and case studies."
        actions={[
          {
            label: "+ Add Before & After",
            href: "/admin/gallery/patient/create",
          },
        ]}
      />

      {/* Cases Grid */}
      {cases.length === 0 ? (
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
              <div className="grid grid-cols-2 h-48 border-b divide-x overflow-hidden bg-muted/20">
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
              </div>

              {/* Heading & Actions */}
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
        confirmLabel={isDeleting ? "Deleting..." : "Delete"}
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  )
}
