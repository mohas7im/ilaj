"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Upload, X, ImageIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card"
import { Button } from "@/components/admin/ui/button"
import { Input } from "@/components/admin/ui/input"
import { Label } from "@/components/admin/ui/label"
import { Textarea } from "@/components/admin/ui/textarea"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/admin/ui/select"
import { SERVICE_STATUS_CONFIG } from "../_services/service.service"
import type { Service, ServiceStatus } from "../_types/service.types"

export type ServiceFormProps = {
  mode: "create" | "edit"
  initialData?: Service
}

export function ServiceForm({ mode, initialData }: ServiceFormProps) {
  const router = useRouter()
  const isEdit = mode === "edit"
  const primaryFileInputRef = useRef<HTMLInputElement>(null)
  const secondaryFileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    name:           initialData?.name           ?? "",
    description:    initialData?.description    ?? "",
    status:         initialData?.status         ?? ("active" as ServiceStatus),
    image:          initialData?.image          ?? "",
    secondaryImage: initialData?.secondaryImage ?? "",
  })

  const set = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleImageChange = (
    key: "image" | "secondaryImage",
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
    try {
      if (isEdit && initialData?.id) {
        await fetch(`/api/services/${initialData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
      } else {
        await fetch("/api/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
      }
    } catch {
      // Fallback redirect for client-side demo
    }
    router.push("/admin/services")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{isEdit ? "Edit Service" : "Add Service"}</CardTitle>
      </CardHeader>
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
                placeholder="e.g. Root Canal Treatment"
                required
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => set("status", (v ?? "active") as ServiceStatus)}
              >
                <SelectTrigger id="status" aria-label="Select status">
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

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Detailed description of this dental service and treatment..."
                rows={3}
              />
            </div>
          </div>

          {/* Two Images Upload Section */}
          <div className="space-y-3 pt-2">
            <div>
              <Label className="text-sm font-semibold">Service Images</Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Upload two images for this service (Primary cover image and secondary detail/procedure photo).
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Primary Image */}
              <div className="space-y-3 p-4 rounded-lg border border-dashed border-border bg-muted/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">1. Primary Image</span>
                  <span className="text-[11px] text-muted-foreground">Main cover photo</span>
                </div>

                <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-md border bg-muted/40">
                  {form.image ? (
                    <img
                      src={form.image}
                      alt="Primary service preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 text-muted-foreground">
                      <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                      <span className="text-xs">No image selected</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    ref={primaryFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageChange("image", e)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => primaryFileInputRef.current?.click()}
                  >
                    <Upload className="mr-1.5 h-3.5 w-3.5" />
                    {form.image ? "Change" : "Upload Image"}
                  </Button>
                  {form.image && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleRemoveImage("image")}
                    >
                      <X className="mr-1 h-3.5 w-3.5" />
                      Remove
                    </Button>
                  )}
                </div>
              </div>

              {/* Secondary Image */}
              <div className="space-y-3 p-4 rounded-lg border border-dashed border-border bg-muted/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">2. Secondary Image</span>
                  <span className="text-[11px] text-muted-foreground">Procedure / detail photo</span>
                </div>

                <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-md border bg-muted/40">
                  {form.secondaryImage ? (
                    <img
                      src={form.secondaryImage}
                      alt="Secondary service preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 text-muted-foreground">
                      <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                      <span className="text-xs">No image selected</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    ref={secondaryFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageChange("secondaryImage", e)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => secondaryFileInputRef.current?.click()}
                  >
                    <Upload className="mr-1.5 h-3.5 w-3.5" />
                    {form.secondaryImage ? "Change" : "Upload Image"}
                  </Button>
                  {form.secondaryImage && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleRemoveImage("secondaryImage")}
                    >
                      <X className="mr-1 h-3.5 w-3.5" />
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/services")}>
              Cancel
            </Button>
            <Button type="submit">
              {isEdit ? "Save Changes" : "Add Service"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
