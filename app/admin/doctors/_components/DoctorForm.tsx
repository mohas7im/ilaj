"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Upload, X, ImageIcon, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/admin/ui/card"
import { LoadingState } from "@/components/admin/ui/loading-state"
import { Button } from "@/components/admin/ui/button"
import { Input } from "@/components/admin/ui/input"
import { Label } from "@/components/admin/ui/label"
import { Textarea } from "@/components/admin/ui/textarea"
import { Switch } from "@/components/admin/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/admin/ui/avatar"
import type { Doctor } from "@/domain/doctor/doctor.types"
import { doctorApiService } from "../_services/doctor.api"
import { getApiErrorMessage } from "@/lib/api/errors"

export type DoctorFormProps = {
  mode: "create" | "edit"
  id?: string
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export function DoctorForm({ mode, id }: DoctorFormProps) {
  if (mode === "create") return <DoctorFormFields mode="create" />
  return <EditDoctorForm id={id!} />
}

function EditDoctorForm({ id }: { id: string }) {
  const router = useRouter()
  const [initialData, setInitialData] = useState<Doctor | null>(null)

  useEffect(() => {
    let active = true
    doctorApiService
      .getById(id)
      .then((data) => {
        if (active) setInitialData(data)
      })
      .catch((error) => {
        if (!active) return
        toast.error(getApiErrorMessage(error, "Doctor not found"))
        router.push("/admin/doctors")
      })
    return () => {
      active = false
    }
  }, [id, router])

  if (!initialData) {
    return (
      <Card>
        <CardContent>
          <LoadingState spinner label="Loading doctor..." />
        </CardContent>
      </Card>
    )
  }

  return <DoctorFormFields mode="edit" initialData={initialData} />
}

function DoctorFormFields({
  mode,
  initialData,
}: {
  mode: "create" | "edit"
  initialData?: Doctor
}) {
  const router = useRouter()
  const isEdit = mode === "edit"
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>(initialData?.image ?? "")

  const [form, setForm] = useState({
    name:           initialData?.name           ?? "",
    designation:    initialData?.designation    ?? "",
    specialization: initialData?.specialization ?? "",
    bio:            initialData?.bio            ?? "",
    image:          initialData?.image          ?? "",
    imageAlt:       initialData?.imageAlt       ?? "",
    displayOrder:   initialData?.displayOrder   ?? 1,
    isActive:       initialData?.isActive       ?? true,
  })

  const set = <K extends keyof typeof form>(key: K, value: typeof form[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file")
      return
    }

    setImageFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setPreviewUrl("")
    set("image", "")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("name", form.name)
      formData.append("designation", form.designation)
      formData.append("specialization", form.specialization)
      formData.append("bio", form.bio)
      formData.append("imageAlt", form.imageAlt)
      formData.append("displayOrder", String(form.displayOrder))
      formData.append("isActive", String(form.isActive))

      if (imageFile) {
        formData.append("image", imageFile)
      } else if (form.image) {
        formData.append("existingImage", form.image)
      }

      if (isEdit && initialData?.id) {
        await doctorApiService.update(initialData.id, formData)
      } else {
        await doctorApiService.create(formData)
      }

      toast.success(isEdit ? "Doctor updated successfully" : "Doctor created successfully")
      router.push("/admin/doctors")
      router.refresh()
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to save doctor"))
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentDisplayImage = previewUrl || form.image

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="name">Full Name <span className="text-destructive">*</span></Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="designation">Designation <span className="text-destructive">*</span></Label>
              <Input
                id="designation"
                value={form.designation}
                onChange={(e) => set("designation", e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="specialization">Specialization <span className="text-destructive">*</span></Label>
              <Input
                id="specialization"
                value={form.specialization}
                onChange={(e) => set("specialization", e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="displayOrder">Display Order <span className="text-destructive">*</span></Label>
              <Input
                id="displayOrder"
                type="number"
                min={1}
                value={form.displayOrder}
                onChange={(e) => set("displayOrder", parseInt(e.target.value) || 1)}
                required
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3.5 sm:col-span-1">
              <div className="space-y-0.5">
                <Label htmlFor="isActive" className="text-sm font-medium">Active Status</Label>
                <p className="text-xs text-muted-foreground">Visible to patients and staff</p>
              </div>
              <Switch
                id="isActive"
                checked={form.isActive}
                onCheckedChange={(checked) => set("isActive", checked)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={form.bio}
              onChange={(e) => set("bio", e.target.value)}
              rows={4}
            />
          </div>

          {/* Profile Photo Upload */}
          <div className="space-y-3 p-4 rounded-lg border border-dashed border-border bg-muted/20">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
              Profile Photo
            </Label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Avatar className="h-16 w-16 shrink-0 border border-border/60 shadow-xs">
                {currentDisplayImage ? (
                  <AvatarImage src={currentDisplayImage} alt={form.imageAlt || form.name || "Doctor photo"} />
                ) : (
                  <AvatarFallback className="text-muted-foreground bg-muted">
                    {form.name ? (
                      <span className="font-medium text-base">{initials(form.name)}</span>
                    ) : (
                      <ImageIcon className="h-7 w-7 text-muted-foreground/60" aria-hidden="true" />
                    )}
                  </AvatarFallback>
                )}
              </Avatar>

              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={isSubmitting}
                    onChange={handleImageFileChange}
                    aria-label="Upload profile photo"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isSubmitting}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                    {currentDisplayImage ? "Change Photo" : "Upload Photo"}
                  </Button>

                  {currentDisplayImage && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={isSubmitting}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={handleRemoveImage}
                    >
                      <X className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                      Remove
                    </Button>
                  )}
                </div>

                <p className="text-xs text-muted-foreground">
                  JPG, PNG, WebP or GIF. Max 10MB recommended.
                </p>
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <Label htmlFor="imageAlt">Photo Description (Alt text)</Label>
              <Input
                id="imageAlt"
                value={form.imageAlt}
                onChange={(e) => set("imageAlt", e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/doctors")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? "Save Changes" : "Add Doctor"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
