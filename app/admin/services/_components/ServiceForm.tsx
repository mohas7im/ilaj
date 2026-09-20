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
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/admin/ui/select"
import { Switch } from "@/components/admin/ui/switch"
import { uploadImage } from "@/lib/upload"
import { SERVICE_STATUS_CONFIG, type Service, type ServiceStatus } from "../_types/service.types"

export type ServiceFormProps = {
  mode: "create" | "edit"
  initialData?: Service
}

export function ServiceForm({ mode, initialData }: ServiceFormProps) {
  const router = useRouter()
  const isEdit = mode === "edit"
  const primaryFileInputRef = useRef<HTMLInputElement>(null)
  const secondaryFileInputRef = useRef<HTMLInputElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadingPrimary, setUploadingPrimary] = useState(false)
  const [uploadingSecondary, setUploadingSecondary] = useState(false)

  const [form, setForm] = useState({
    name:              initialData?.name              ?? "",
    slug:              initialData?.slug              ?? "",
    description:       initialData?.description       ?? "",
    status:            (initialData?.status           ?? "active") as ServiceStatus,
    displayOrder:      initialData?.displayOrder      ?? 1,
    showInHomePage:    initialData?.showInHomePage    ?? false,
    image:             initialData?.image             ?? "",
    imageAlt:          initialData?.imageAlt          ?? "",
    secondaryImage:    initialData?.secondaryImage    ?? "",
    secondaryImageAlt: initialData?.secondaryImageAlt ?? "",
  })

  const set = <K extends keyof typeof form>(key: K, value: typeof form[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleImageChange = async (
    key: "image" | "secondaryImage",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    const isPrimary = key === "image"
    if (isPrimary) setUploadingPrimary(true)
    else setUploadingSecondary(true)

    try {
      const url = await uploadImage(file, "services")
      set(key, url)
      toast.success(`${isPrimary ? "Primary" : "Secondary"} image uploaded successfully`)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload image"
      toast.error(msg)
    } finally {
      if (isPrimary) setUploadingPrimary(false)
      else setUploadingSecondary(false)
    }
  }

  const handleRemoveImage = (key: "image" | "secondaryImage") => {
    set(key, "")
    if (key === "image" && primaryFileInputRef.current) {
      primaryFileInputRef.current.value = ""
    }
    if (key === "secondaryImage" && secondaryFileInputRef.current) {
      secondaryFileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = isEdit && initialData?.id ? `/api/services/${initialData.id}` : "/api/services"
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
          : "Failed to save service"
        throw new Error(errorMsg)
      }

      toast.success(isEdit ? "Service updated successfully" : "Service created successfully")
      router.push("/admin/services")
      router.refresh()
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to save service"
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }


  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="name">
                Service Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                required
              />
            </div>

            {/* Status */}
            <div className="space-y-1.5 sm:col-span-1">
              <Label htmlFor="status">Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => set("status", (v ?? "active") as ServiceStatus)}
              >
                <SelectTrigger id="status" className="w-full" aria-label="Select status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(SERVICE_STATUS_CONFIG) as ServiceStatus[]).map((s) => (
                    <SelectItem key={s} value={s}>
                      {SERVICE_STATUS_CONFIG[s].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Display Order */}
            <div className="space-y-1.5 sm:col-span-1">
              <Label htmlFor="displayOrder">
                Display Order <span className="text-destructive">*</span>
              </Label>
              <Input
                id="displayOrder"
                type="number"
                min={1}
                value={form.displayOrder}
                onChange={(e) =>
                  set("displayOrder", parseInt(e.target.value, 10) || 1)
                }
                required
              />
            </div>

            {/* Show on Home Page */}
            <div className="flex items-center justify-between rounded-lg border p-3.5 bg-muted/20 sm:col-span-2">
              <div className="space-y-0.5">
                <Label htmlFor="showInHomePage" className="text-sm font-medium cursor-pointer">
                  Show on Home Page
                </Label>
                <p className="text-xs text-muted-foreground">
                  Display this service as a highlight on the clinic homepage.
                </p>
              </div>
              <Switch
                id="showInHomePage"
                checked={form.showInHomePage}
                onCheckedChange={(checked) => set("showInHomePage", checked)}
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {/* Two Images Upload Section */}
          <div className="space-y-3 pt-2">
            <div>
              <Label className="text-sm font-semibold">Service Images</Label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Primary Image */}
              <div className="space-y-3 p-4 rounded-lg border border-dashed border-border bg-muted/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">1. Primary Image</span>
                </div>

                <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-md border bg-muted/40">
                  {uploadingPrimary ? (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-7 w-7 animate-spin text-primary" />
                      <span className="text-xs font-medium">Uploading primary image...</span>
                    </div>
                  ) : form.image ? (
                    <img
                      src={form.image}
                      alt={form.imageAlt || "Primary service preview"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    ref={primaryFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingPrimary}
                    onChange={(e) => handleImageChange("image", e)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={uploadingPrimary}
                    onClick={() => primaryFileInputRef.current?.click()}
                  >
                    {uploadingPrimary ? (
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Upload className="mr-1.5 h-3.5 w-3.5" />
                    )}
                    {uploadingPrimary ? "Uploading..." : form.image ? "Change" : "Upload Image"}
                  </Button>
                  {form.image && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={uploadingPrimary}
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleRemoveImage("image")}
                    >
                      <X className="mr-1 h-3.5 w-3.5" />
                      Remove
                    </Button>
                  )}
                </div>

                {/* Primary Image Alt Text */}
                <div className="space-y-1.5 pt-2 border-t border-border/60">
                  <Label htmlFor="imageAlt" className="text-xs">
                    Image Alt Text
                  </Label>
                  <Input
                    id="imageAlt"
                    value={form.imageAlt}
                    onChange={(e) => set("imageAlt", e.target.value)}
                  />
                </div>
              </div>

              {/* Secondary Image */}
              <div className="space-y-3 p-4 rounded-lg border border-dashed border-border bg-muted/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">2. Secondary Image</span>
                </div>

                <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-md border bg-muted/40">
                  {uploadingSecondary ? (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-7 w-7 animate-spin text-primary" />
                      <span className="text-xs font-medium">Uploading secondary image...</span>
                    </div>
                  ) : form.secondaryImage ? (
                    <img
                      src={form.secondaryImage}
                      alt={form.secondaryImageAlt || "Secondary service preview"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    ref={secondaryFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingSecondary}
                    onChange={(e) => handleImageChange("secondaryImage", e)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={uploadingSecondary}
                    onClick={() => secondaryFileInputRef.current?.click()}
                  >
                    {uploadingSecondary ? (
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Upload className="mr-1.5 h-3.5 w-3.5" />
                    )}
                    {uploadingSecondary ? "Uploading..." : form.secondaryImage ? "Change" : "Upload Image"}
                  </Button>
                  {form.secondaryImage && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={uploadingSecondary}
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleRemoveImage("secondaryImage")}
                    >
                      <X className="mr-1 h-3.5 w-3.5" />
                      Remove
                    </Button>
                  )}
                </div>

                {/* Secondary Image Alt Text */}
                <div className="space-y-1.5 pt-2 border-t border-border/60">
                  <Label htmlFor="secondaryImageAlt" className="text-xs">
                    Secondary Image Alt Text
                  </Label>
                  <Input
                    id="secondaryImageAlt"
                    value={form.secondaryImageAlt}
                    onChange={(e) => set("secondaryImageAlt", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/services")}
              disabled={isSubmitting || uploadingPrimary || uploadingSecondary}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || uploadingPrimary || uploadingSecondary}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEdit ? "Saving Changes..." : "Adding Service..."}
                </>
              ) : (
                isEdit ? "Save Changes" : "Add Service"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
