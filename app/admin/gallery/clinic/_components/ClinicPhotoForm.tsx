"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Upload, X, ImageIcon } from "lucide-react"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/admin/ui/card"
import { LoadingState } from "@/components/admin/ui/loading-state"
import { Button } from "@/components/admin/ui/button"
import { Input } from "@/components/admin/ui/input"
import { Label } from "@/components/admin/ui/label"
import { Textarea } from "@/components/admin/ui/textarea"
import { Spinner } from "@/components/admin/ui/spinner"
import type { ClinicPhoto } from "@/domain/clinic-photo/clinic-photo.types"
import { clinicPhotoSchema, type ClinicPhotoInput } from "@/domain/clinic-photo/clinic-photo.schema"
import { clinicPhotoApiService } from "../_services/clinic-photo.api"
import { getApiErrorMessage } from "@/lib/api/errors"

export type ClinicPhotoFormProps = {
  mode: "create" | "edit"
  id?: string
}

export function ClinicPhotoForm({ mode, id }: ClinicPhotoFormProps) {
  if (mode === "create") return <ClinicPhotoFormFields mode="create" />
  return <EditClinicPhotoForm id={id!} />
}

function EditClinicPhotoForm({ id }: { id: string }) {
  const router = useRouter()
  const [initialData, setInitialData] = useState<ClinicPhoto | null>(null)

  useEffect(() => {
    let active = true
    clinicPhotoApiService
      .getById(id)
      .then((data) => {
        if (active) setInitialData(data)
      })
      .catch((error) => {
        if (!active) return
        toast.error(getApiErrorMessage(error, "Clinic photo not found"))
        router.push("/admin/gallery/clinic")
      })
    return () => {
      active = false
    }
  }, [id, router])

  if (!initialData) {
    return (
      <Card>
        <CardContent>
          <LoadingState spinner label="Loading clinic photo..." />
        </CardContent>
      </Card>
    )
  }

  return <ClinicPhotoFormFields mode="edit" initialData={initialData} />
}

function ClinicPhotoFormFields({
  mode,
  initialData,
}: {
  mode: "create" | "edit"
  initialData?: ClinicPhoto
}) {
  const router = useRouter()
  const isEdit = mode === "edit"
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [apiError, setApiError] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>(initialData?.image ?? "")

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ClinicPhotoInput>({
    // We make image optional in schema validation if they are uploading a file
    // But our base schema requires it, so we'll bypass it if imageFile exists
    resolver: zodResolver(clinicPhotoSchema) as any,
    defaultValues: {
      heading: initialData?.heading ?? "",
      description: initialData?.description ?? "",
      image: initialData?.image ?? "temp-file", // We manage the file separately or pass dummy to pass zod before checking file
      alt: initialData?.alt ?? "",
      displayOrder: initialData?.displayOrder ?? 1,
    },
  })

  // We actually need the image field to be valid if there's a file
  // Let's set it to some string when a file is selected so zod doesn't complain.
  
  const currentImage = watch("image")

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file")
      return
    }

    setApiError(null)
    setImageFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    setValue("image", "new-upload", { shouldValidate: true })
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setPreviewUrl("")
    setValue("image", "", { shouldValidate: true })
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const currentDisplayImage = previewUrl || (currentImage !== "new-upload" && currentImage !== "temp-file" ? currentImage : "") || initialData?.image

  const onSubmit = async (data: ClinicPhotoInput) => {
    setApiError(null)

    if (!imageFile && (!data.image || data.image === "new-upload" || data.image === "temp-file") && !initialData?.image) {
      setApiError("Please select a photo.")
      return
    }

    try {
      const formData = new FormData()
      formData.append("heading", data.heading)
      formData.append("description", data.description ?? "")
      formData.append("alt", data.alt)
      formData.append("displayOrder", String(data.displayOrder))

      if (imageFile) {
        formData.append("image", imageFile)
      } else if (initialData?.image) {
        formData.append("existingImage", initialData.image)
      }

      if (isEdit && initialData?.id) {
        await clinicPhotoApiService.update(initialData.id, formData)
      } else {
        await clinicPhotoApiService.create(formData)
      }

      toast.success(isEdit ? "Clinic photo updated successfully" : "Clinic photo added successfully")
      router.push("/admin/gallery/clinic")
      router.refresh()
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err, "Failed to save clinic photo")
      setApiError(msg)
      toast.error(msg)
    }
  }

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          {apiError && (
            <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive font-medium">
              {apiError}
            </div>
          )}

          {/* Heading */}
          <div className="space-y-1.5">
            <Label htmlFor="heading">
              Heading <span className="text-destructive">*</span>
            </Label>
            <Input
              id="heading"
              {...register("heading")}
              aria-invalid={!!errors.heading}
            />
            {errors.heading && <p className="mt-1 text-xs text-destructive">{errors.heading.message}</p>}
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
                {...register("displayOrder")}
                aria-invalid={!!errors.displayOrder}
              />
              {errors.displayOrder && <p className="mt-1 text-xs text-destructive">{errors.displayOrder.message}</p>}
            </div>

            {/* Image Alt Text Input */}
            <div className="space-y-1.5">
              <Label htmlFor="alt">
                Image Alt Text <span className="text-destructive">*</span>
              </Label>
              <Input
                id="alt"
                {...register("alt")}
                aria-invalid={!!errors.alt}
              />
              {errors.alt && <p className="mt-1 text-xs text-destructive">{errors.alt.message}</p>}
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
              {currentDisplayImage ? (
                <img
                  src={currentDisplayImage}
                  alt={watch("alt") || "Clinic photo preview"}
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
                disabled={isSubmitting}
                onChange={handleImageFile}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isSubmitting}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mr-1.5 h-3.5 w-3.5" />
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
                  <X className="mr-1 h-3.5 w-3.5" />
                  Remove
                </Button>
              )}
            </div>
            {errors.image && <p className="text-xs text-destructive">{errors.image.message}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              rows={4}
              aria-invalid={!!errors.description}
            />
            {errors.description && <p className="mt-1 text-xs text-destructive">{errors.description.message}</p>}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/gallery/clinic")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Spinner className="mr-1.5 size-3.5" />}
              {isEdit ? "Save Changes" : "Add Photo"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
