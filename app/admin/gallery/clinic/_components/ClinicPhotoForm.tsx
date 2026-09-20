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
import { uploadImage } from "@/lib/upload"
import type { ClinicPhoto } from "../_types/clinic-photo.types"

export type ClinicPhotoFormProps = {
  mode: "create" | "edit"
  initialData?: ClinicPhoto
}

export function ClinicPhotoForm({ mode, initialData }: ClinicPhotoFormProps) {
  const router = useRouter()
  const isEdit = mode === "edit"
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [submitting, setSubmitting] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    heading: initialData?.heading ?? "",
    description: initialData?.description ?? "",
    image: initialData?.image ?? "",
    alt: initialData?.alt ?? "",
    displayOrder: initialData?.displayOrder ?? 1,
  })

  const set = <K extends keyof typeof form>(key: K, value: typeof form[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (error) setError(null)
  }

  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(true)
    setError(null)
    try {
      const url = await uploadImage(file, "clinic-photos")
      set("image", url)
      toast.success("Photo uploaded successfully")
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload photo"
      setError(msg)
      toast.error(msg)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleRemoveImage = () => {
    set("image", "")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.image) {
      setError("Please select or upload a photo.")
      return
    }
    if (!form.alt.trim()) {
      setError("Please provide an alternative text (alt text) for the image.")
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const url = isEdit && initialData?.id ? `/api/gallery/clinic/${initialData.id}` : "/api/gallery/clinic"
      const method = isEdit ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        const errorMsg = data?.error
          ? typeof data.error === "object"
            ? Object.values(data.error).flat().join(", ")
            : String(data.error)
          : "Failed to save clinic photo"
        throw new Error(errorMsg)
      }

      toast.success(isEdit ? "Clinic photo updated successfully" : "Clinic photo added successfully")
      router.push("/admin/gallery/clinic")
      router.refresh()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong"
      setError(msg)
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive font-medium">
              {error}
            </div>
          )}

          {/* Heading */}
          <div className="space-y-1.5">
            <Label htmlFor="heading">
              Heading <span className="text-destructive">*</span>
            </Label>
            <Input
              id="heading"
              value={form.heading}
              onChange={(e) => set("heading", e.target.value)}
              required
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
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

            {/* Image Alt Text Input */}
            <div className="space-y-1.5">
              <Label htmlFor="alt">
                Image Alt Text <span className="text-destructive">*</span>
              </Label>
              <Input
                id="alt"
                value={form.alt}
                onChange={(e) => set("alt", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Photo Upload Area */}
          <div className="space-y-2 p-4 rounded-lg border bg-muted/20">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                Photo Asset <span className="text-destructive">*</span>
              </Label>
              <span className="text-[11px] text-muted-foreground">
                JPG, PNG or WebP recommended
              </span>
            </div>

            <div className="relative aspect-video w-full rounded-md border overflow-hidden bg-muted/40 flex items-center justify-center">
              {uploadingImage ? (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="text-xs font-medium">Uploading photo...</span>
                </div>
              ) : form.image ? (
                <img
                  src={form.image}
                  alt={form.alt || "Clinic photo preview"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
              )}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploadingImage}
                onChange={handleImageFile}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={uploadingImage}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploadingImage ? (
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Upload className="mr-1.5 h-3.5 w-3.5" />
                )}
                {uploadingImage
                  ? "Uploading..."
                  : form.image
                  ? "Change Photo"
                  : "Upload Photo"}
              </Button>
              {form.image && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={uploadingImage}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={handleRemoveImage}
                >
                  <X className="mr-1 h-3.5 w-3.5" />
                  Remove
                </Button>
              )}
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
              onClick={() => router.push("/admin/gallery/clinic")}
              disabled={submitting || uploadingImage}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting || uploadingImage}>
              {submitting && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
              {isEdit ? "Save Changes" : "Add Photo"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
