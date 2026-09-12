"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Upload, X, ImageIcon, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/admin/ui/card"
import { Button } from "@/components/admin/ui/button"
import { Input } from "@/components/admin/ui/input"
import { Label } from "@/components/admin/ui/label"
import { Textarea } from "@/components/admin/ui/textarea"
import type { PatientCase } from "../_types/patient-case.types"

export type PatientCaseFormProps = {
  mode: "create" | "edit"
  initialData?: PatientCase
}

export function PatientCaseForm({ mode, initialData }: PatientCaseFormProps) {
  const router = useRouter()
  const isEdit = mode === "edit"

  const beforeFileRef = useRef<HTMLInputElement>(null)
  const afterFileRef = useRef<HTMLInputElement>(null)

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    heading: initialData?.heading ?? "",
    description: initialData?.description ?? "",
    beforeImage: initialData?.beforeImage ?? "/admin/patient-before-after.jpg",
    afterImage: initialData?.afterImage ?? "/admin/patient-before-after.jpg",
    beforeAlt: initialData?.beforeAlt ?? "",
    afterAlt: initialData?.afterAlt ?? "",
  })

  const set = <K extends keyof typeof form>(key: K, value: typeof form[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (error) setError(null)
  }

  const handleImageFile = (
    key: "beforeImage" | "afterImage",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      set(key, result)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = (key: "beforeImage" | "afterImage") => {
    set(key, "")
    if (key === "beforeImage" && beforeFileRef.current) {
      beforeFileRef.current.value = ""
    }
    if (key === "afterImage" && afterFileRef.current) {
      afterFileRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.beforeImage) {
      setError("Please select or upload a Before photo.")
      return
    }
    if (!form.afterImage) {
      setError("Please select or upload an After photo.")
      return
    }
    if (!form.beforeAlt.trim()) {
      setError("Please provide an alternative text (alt text) for the Before image.")
      return
    }
    if (!form.afterAlt.trim()) {
      setError("Please provide an alternative text (alt text) for the After image.")
      return
    }
    if (!form.description.trim()) {
      setError("Please provide a description of the treatment case.")
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      if (isEdit && initialData?.id) {
        const res = await fetch(`/api/gallery/patient/${initialData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
        if (!res.ok) {
          throw new Error("Failed to update patient case")
        }
      } else {
        const res = await fetch("/api/gallery/patient", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
        if (!res.ok) {
          throw new Error("Failed to add patient case")
        }
      }
      router.push("/admin/gallery/patient")
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          {isEdit ? "Edit Before & After Case" : "Add Before & After Case"}
        </CardTitle>
        <CardDescription>
          {isEdit
            ? "Update transformation case details, before/after images, and accessibility texts."
            : "Upload before and after photos showcasing patient smile transformations."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive font-medium">
              {error}
            </div>
          )}

          {/* Heading */}
          <div className="space-y-1.5">
            <Label htmlFor="heading">
              Case Heading <span className="text-destructive">*</span>
            </Label>
            <Input
              id="heading"
              value={form.heading}
              onChange={(e) => set("heading", e.target.value)}
              placeholder="e.g. Teeth Alignment & Whitening"
              required
            />
          </div>

          {/* Before & After Images Grid */}
          <div className="grid gap-5 sm:grid-cols-2">
            {/* ── Before Image Column ── */}
            <div className="space-y-3 p-4 rounded-lg border bg-muted/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                  Before Image <span className="text-destructive">*</span>
                </span>
                <span className="rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-semibold text-white uppercase">
                  Before
                </span>
              </div>

              <div className="relative aspect-video w-full rounded-md border overflow-hidden bg-muted/40 flex items-center justify-center">
                {form.beforeImage ? (
                  <img
                    src={form.beforeImage}
                    alt={form.beforeAlt || "Before image preview"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
                )}
              </div>

              <div className="flex items-center gap-2 pt-1">
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
                  onClick={() => beforeFileRef.current?.click()}
                >
                  <Upload className="mr-1.5 h-3.5 w-3.5" />
                  {form.beforeImage ? "Change Before" : "Upload Before"}
                </Button>
                {form.beforeImage && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleRemoveImage("beforeImage")}
                  >
                    <X className="mr-1 h-3.5 w-3.5" />
                    Remove
                  </Button>
                )}
              </div>

              {/* Before Alt Text */}
              <div className="space-y-1.5 pt-2 border-t border-border/60">
                <Label htmlFor="beforeAlt" className="text-xs">
                  Before Image Alt Text <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="beforeAlt"
                  value={form.beforeAlt}
                  onChange={(e) => set("beforeAlt", e.target.value)}
                  placeholder="e.g. Patient teeth before orthodontic alignment showing gaps"
                  required
                />
              </div>
            </div>

            {/* ── After Image Column ── */}
            <div className="space-y-3 p-4 rounded-lg border bg-muted/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary block">
                  After Image <span className="text-destructive">*</span>
                </span>
                <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground uppercase">
                  After
                </span>
              </div>

              <div className="relative aspect-video w-full rounded-md border overflow-hidden bg-muted/40 flex items-center justify-center">
                {form.afterImage ? (
                  <img
                    src={form.afterImage}
                    alt={form.afterAlt || "After image preview"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
                )}
              </div>

              <div className="flex items-center gap-2 pt-1">
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
                  onClick={() => afterFileRef.current?.click()}
                >
                  <Upload className="mr-1.5 h-3.5 w-3.5" />
                  {form.afterImage ? "Change After" : "Upload After"}
                </Button>
                {form.afterImage && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleRemoveImage("afterImage")}
                  >
                    <X className="mr-1 h-3.5 w-3.5" />
                    Remove
                  </Button>
                )}
              </div>

              {/* After Alt Text */}
              <div className="space-y-1.5 pt-2 border-t border-border/60">
                <Label htmlFor="afterAlt" className="text-xs">
                  After Image Alt Text <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="afterAlt"
                  value={form.afterAlt}
                  onChange={(e) => set("afterAlt", e.target.value)}
                  placeholder="e.g. Patient complete smile after clear aligner treatment"
                  required
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Describe the clinical treatment, procedures performed, and transformation outcome..."
              rows={4}
              required
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/gallery/patient")}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
              {isEdit ? "Save Changes" : "Add Case"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
