"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Upload, X, ImageIcon, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/admin/ui/card"
import { Button } from "@/components/admin/ui/button"
import { Input } from "@/components/admin/ui/input"
import { Label } from "@/components/admin/ui/label"
import { Textarea } from "@/components/admin/ui/textarea"
import type { PatientCase } from "../_types/patient-case.types"
import { patientCaseApiService } from "../_services/patient-case.api"
import { getApiErrorMessage } from "@/lib/api/errors"

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
  const [beforeFile, setBeforeFile] = useState<File | null>(null)
  const [afterFile, setAfterFile] = useState<File | null>(null)
  const [beforePreviewUrl, setBeforePreviewUrl] = useState<string>(initialData?.beforeImage ?? "")
  const [afterPreviewUrl, setAfterPreviewUrl] = useState<string>(initialData?.afterImage ?? "")
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    heading: initialData?.heading ?? "",
    description: initialData?.description ?? "",
    beforeImage: initialData?.beforeImage ?? "",
    afterImage: initialData?.afterImage ?? "",
    beforeAlt: initialData?.beforeAlt ?? "",
    afterAlt: initialData?.afterAlt ?? "",
    displayOrder: initialData?.displayOrder ?? 1,
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

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file")
      return
    }

    setError(null)
    const preview = URL.createObjectURL(file)

    if (key === "beforeImage") {
      setBeforeFile(file)
      setBeforePreviewUrl(preview)
    } else {
      setAfterFile(file)
      setAfterPreviewUrl(preview)
    }
  }

  const handleRemoveImage = (key: "beforeImage" | "afterImage") => {
    if (key === "beforeImage") {
      setBeforeFile(null)
      setBeforePreviewUrl("")
      set("beforeImage", "")
      if (beforeFileRef.current) beforeFileRef.current.value = ""
    } else {
      setAfterFile(null)
      setAfterPreviewUrl("")
      set("afterImage", "")
      if (afterFileRef.current) afterFileRef.current.value = ""
    }
  }

  const currentBeforeDisplay = beforePreviewUrl || form.beforeImage
  const currentAfterDisplay = afterPreviewUrl || form.afterImage

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!beforeFile && !form.beforeImage) {
      setError("Please select a Before photo.")
      return
    }
    if (!afterFile && !form.afterImage) {
      setError("Please select an After photo.")
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

    setSubmitting(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("heading", form.heading)
      formData.append("description", form.description)
      formData.append("beforeAlt", form.beforeAlt)
      formData.append("afterAlt", form.afterAlt)
      formData.append("displayOrder", String(form.displayOrder))

      if (beforeFile) {
        formData.append("beforeImage", beforeFile)
      } else if (form.beforeImage) {
        formData.append("existingBeforeImage", form.beforeImage)
      }

      if (afterFile) {
        formData.append("afterImage", afterFile)
      } else if (form.afterImage) {
        formData.append("existingAfterImage", form.afterImage)
      }

      if (isEdit && initialData?.id) {
        await patientCaseApiService.update(initialData.id, formData)
      } else {
        await patientCaseApiService.create(formData)
      }

      toast.success(isEdit ? "Patient case updated successfully" : "Patient case added successfully")
      router.push("/admin/gallery/patient")
      router.refresh()
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err, "Failed to save patient case")
      setError(msg)
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive font-medium">
              {error}
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-3">
            {/* Heading */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="heading">
                Case Heading <span className="text-destructive">*</span>
              </Label>
              <Input
                id="heading"
                value={form.heading}
                onChange={(e) => set("heading", e.target.value)}
                required
              />
            </div>

            {/* Display Order */}
            <div className="space-y-1.5">
              <Label htmlFor="displayOrder">
                Display Order <span className="text-destructive">*</span>
              </Label>
              <Input
                id="displayOrder"
                type="number"
                min={1}
                value={form.displayOrder}
                onChange={(e) => set("displayOrder", parseInt(e.target.value) || 1)}
                required
              />
            </div>
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
                {currentBeforeDisplay ? (
                  <img
                    src={currentBeforeDisplay}
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
                  disabled={submitting}
                  onChange={(e) => handleImageFile("beforeImage", e)}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={submitting}
                  onClick={() => beforeFileRef.current?.click()}
                >
                  <Upload className="mr-1.5 h-3.5 w-3.5" />
                  {currentBeforeDisplay ? "Change Before" : "Upload Before"}
                </Button>
                {currentBeforeDisplay && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={submitting}
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
                {currentAfterDisplay ? (
                  <img
                    src={currentAfterDisplay}
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
                  disabled={submitting}
                  onChange={(e) => handleImageFile("afterImage", e)}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={submitting}
                  onClick={() => afterFileRef.current?.click()}
                >
                  <Upload className="mr-1.5 h-3.5 w-3.5" />
                  {currentAfterDisplay ? "Change After" : "Upload After"}
                </Button>
                {currentAfterDisplay && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={submitting}
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
                  required
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={4}
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
