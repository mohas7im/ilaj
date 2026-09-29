"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Upload, X, ImageIcon } from "lucide-react"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/admin/ui/card"
import { LoadingState } from "@/components/admin/ui/loading-state"
import { Button } from "@/components/admin/ui/button"
import { Input } from "@/components/admin/ui/input"
import { Label } from "@/components/admin/ui/label"
import { Textarea } from "@/components/admin/ui/textarea"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/admin/ui/select"
import { Switch } from "@/components/admin/ui/switch"
import { Spinner } from "@/components/admin/ui/spinner"
import { RichTextEditor } from "@/components/admin/RichTextEditor"
import { ServiceFaqFields, toServiceFaqRows, type ServiceFaqRow } from "./ServiceFaqFields"
import type { Service, ServiceStatus } from "@/domain/service/service.types"
import { serviceSchema, type ServiceFormData } from "@/domain/service/service.schema"
import { SERVICE_STATUS_CONFIG } from "./service-status"
import { serviceApiService } from "../_services/service.api"
import { getApiErrorMessage } from "@/lib/api/errors"

export type ServiceFormProps = {
  mode: "create" | "edit"
  id?: string
}

export function ServiceForm({ mode, id }: ServiceFormProps) {
  if (mode === "create") return <ServiceFormFields mode="create" />
  return <EditServiceForm id={id!} />
}

function EditServiceForm({ id }: { id: string }) {
  const router = useRouter()
  const [initialData, setInitialData] = useState<Service | null>(null)

  useEffect(() => {
    let active = true
    serviceApiService
      .getById(id)
      .then((data) => {
        if (active) setInitialData(data)
      })
      .catch((error) => {
        if (!active) return
        toast.error(getApiErrorMessage(error, "Service not found"))
        router.push("/admin/services")
      })
    return () => {
      active = false
    }
  }, [id, router])

  if (!initialData) {
    return (
      <Card>
        <CardContent>
          <LoadingState spinner label="Loading service..." />
        </CardContent>
      </Card>
    )
  }

  return <ServiceFormFields mode="edit" initialData={initialData} />
}

function ServiceFormFields({
  mode,
  initialData,
}: {
  mode: "create" | "edit"
  initialData?: Service
}) {
  const router = useRouter()
  const isEdit = mode === "edit"
  const primaryFileInputRef = useRef<HTMLInputElement>(null)
  const secondaryFileInputRef = useRef<HTMLInputElement>(null)
  const [primaryFile, setPrimaryFile] = useState<File | null>(null)
  const [secondaryFile, setSecondaryFile] = useState<File | null>(null)
  const [primaryPreviewUrl, setPrimaryPreviewUrl] = useState<string>(initialData?.image ?? "")
  const [secondaryPreviewUrl, setSecondaryPreviewUrl] = useState<string>(initialData?.secondaryImage ?? "")
  const [faqRows, setFaqRows] = useState<ServiceFaqRow[]>(() => toServiceFaqRows(initialData?.faqs))

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema) as any,
    defaultValues: {
      name: initialData?.name ?? "",
      slug: initialData?.slug ?? "",
      description: initialData?.description ?? "",
      details: initialData?.details ?? "",
      status: (initialData?.status ?? "active") as "active" | "inactive",
      displayOrder: initialData?.displayOrder ?? 1,
      showInHomePage: initialData?.showInHomePage ?? false,
      image: initialData?.image ?? "",
      imageAlt: initialData?.imageAlt ?? "",
      secondaryImage: initialData?.secondaryImage ?? "",
      secondaryImageAlt: initialData?.secondaryImageAlt ?? "",
      metaTitle: initialData?.metaTitle ?? "",
      metaDescription: initialData?.metaDescription ?? "",
    },
  })

  // Watch for image removals so preview updates
  const currentImage = watch("image")
  const currentSecondaryImage = watch("secondaryImage")

  const handleImageChange = (
    key: "image" | "secondaryImage",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file")
      return
    }

    const preview = URL.createObjectURL(file)
    if (key === "image") {
      setPrimaryFile(file)
      setPrimaryPreviewUrl(preview)
    } else {
      setSecondaryFile(file)
      setSecondaryPreviewUrl(preview)
    }
  }

  const handleRemoveImage = (key: "image" | "secondaryImage") => {
    if (key === "image") {
      setPrimaryFile(null)
      setPrimaryPreviewUrl("")
      setValue("image", "")
      if (primaryFileInputRef.current) primaryFileInputRef.current.value = ""
    } else {
      setSecondaryFile(null)
      setSecondaryPreviewUrl("")
      setValue("secondaryImage", "")
      if (secondaryFileInputRef.current) secondaryFileInputRef.current.value = ""
    }
  }

  const currentPrimaryDisplay = primaryPreviewUrl || currentImage
  const currentSecondaryDisplay = secondaryPreviewUrl || currentSecondaryImage

  const onSubmit = async (data: ServiceFormData) => {

    // Validate FAQs locally (we don't strictly use RHF array fields here because ServiceFaqFields is custom)
    const faqs = faqRows
      .map((row) => ({ question: row.question.trim(), answer: row.answer.trim() }))
      .filter((faq) => faq.question || faq.answer)
    if (faqs.some((faq) => !faq.question || !faq.answer)) {
      toast.error("Each FAQ needs both a question and an answer")
      return
    }

    try {
      const formData = new FormData()
      formData.append("name", data.name)
      if (data.slug) formData.append("slug", data.slug)
      if (data.description) formData.append("description", data.description)
      formData.append("details", data.details ?? "")
      formData.append("faqs", JSON.stringify(faqs))
      formData.append("status", data.status)
      formData.append("displayOrder", String(data.displayOrder))
      formData.append("showInHomePage", String(data.showInHomePage))
      if (data.imageAlt) formData.append("imageAlt", data.imageAlt)
      if (data.secondaryImageAlt) formData.append("secondaryImageAlt", data.secondaryImageAlt)
      // Always sent, so clearing a field falls back to the name / description again
      formData.append("metaTitle", data.metaTitle ?? "")
      formData.append("metaDescription", data.metaDescription ?? "")

      if (primaryFile) {
        formData.append("image", primaryFile)
      } else if (data.image) {
        formData.append("existingImage", data.image)
      }

      if (secondaryFile) {
        formData.append("secondaryImage", secondaryFile)
      } else if (data.secondaryImage) {
        formData.append("existingSecondaryImage", data.secondaryImage)
      }

      if (isEdit && initialData?.id) {
        await serviceApiService.update(initialData.id, formData)
      } else {
        await serviceApiService.create(formData)
      }

      toast.success(isEdit ? "Service updated successfully" : "Service created successfully")
      router.push("/admin/services")
      router.refresh()
    } catch (error) {
      const msg = getApiErrorMessage(error, "Failed to save service")
      toast.error(msg)
    }
  }

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="name">
                Service Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                {...register("name")}
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            {/* Status */}
            <div className="space-y-1.5 sm:col-span-1">
              <Label htmlFor="status">Status</Label>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger id="status" className="w-full" aria-label="Select status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent alignItemWithTrigger={false}>
                      {(Object.keys(SERVICE_STATUS_CONFIG) as ServiceStatus[]).map((s) => (
                        <SelectItem key={s} value={s}>
                          {SERVICE_STATUS_CONFIG[s].label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && (
                <p className="mt-1 text-xs text-destructive">{errors.status.message}</p>
              )}
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
                {...register("displayOrder")}
                aria-invalid={!!errors.displayOrder}
              />
              {errors.displayOrder && (
                <p className="mt-1 text-xs text-destructive">{errors.displayOrder.message}</p>
              )}
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
              <Controller
                control={control}
                name="showInHomePage"
                render={({ field }) => (
                  <Switch
                    id="showInHomePage"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                rows={3}
                aria-invalid={!!errors.description}
              />
              {errors.description && (
                <p className="mt-1 text-xs text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label id="details-label">Detailed Description</Label>
              <Controller
                control={control}
                name="details"
                render={({ field }) => (
                  <RichTextEditor
                    id="details"
                    aria-labelledby="details-label"
                    value={field.value || ""}
                    onChange={field.onChange}
                  />
                )}
              />
              <p className="text-xs text-muted-foreground">
                Main content of the treatment page on the website.
              </p>
            </div>
          </div>

          <ServiceFaqFields rows={faqRows} onChange={setFaqRows} />

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
                  {currentPrimaryDisplay ? (
                    <img
                      src={currentPrimaryDisplay}
                      alt={watch("imageAlt") ?? ""}
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
                    disabled={isSubmitting}
                    onChange={(e) => handleImageChange("image", e)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isSubmitting}
                    onClick={() => primaryFileInputRef.current?.click()}
                  >
                    <Upload className="mr-1.5 h-3.5 w-3.5" />
                    {currentPrimaryDisplay ? "Change" : "Upload Image"}
                  </Button>
                  {currentPrimaryDisplay && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={isSubmitting}
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
                    {...register("imageAlt")}
                  />
                </div>
              </div>

              {/* Secondary Image */}
              <div className="space-y-3 p-4 rounded-lg border border-dashed border-border bg-muted/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">2. Secondary Image</span>
                </div>

                <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-md border bg-muted/40">
                  {currentSecondaryDisplay ? (
                    <img
                      src={currentSecondaryDisplay}
                      alt={watch("secondaryImageAlt") ?? ""}
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
                    disabled={isSubmitting}
                    onChange={(e) => handleImageChange("secondaryImage", e)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isSubmitting}
                    onClick={() => secondaryFileInputRef.current?.click()}
                  >
                    <Upload className="mr-1.5 h-3.5 w-3.5" />
                    {currentSecondaryDisplay ? "Change" : "Upload Image"}
                  </Button>
                  {currentSecondaryDisplay && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={isSubmitting}
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
                    {...register("secondaryImageAlt")}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Search Engine (SEO) */}
          <div className="space-y-3 pt-2">
            <div>
              <Label className="text-sm font-semibold">Search Engine (SEO)</Label>
              <p className="text-xs text-muted-foreground">
                Optional. Leave empty to use the service name and description.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="metaTitle">SEO Title</Label>
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {(watch("metaTitle") || "").length} / 40 chars
                  </span>
                </div>
                <Input
                  id="metaTitle"
                  {...register("metaTitle")}
                  aria-invalid={!!errors.metaTitle}
                />
                <p className="text-xs text-muted-foreground">
                  The clinic name is added automatically at the end — don&apos;t include it.
                </p>
                {errors.metaTitle && (
                  <p className="mt-1 text-xs text-destructive">{errors.metaTitle.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {(watch("metaDescription") || "").length} / 160 chars
                  </span>
                </div>
                <Textarea
                  id="metaDescription"
                  rows={2}
                  {...register("metaDescription")}
                  aria-invalid={!!errors.metaDescription}
                />
                <p className="text-xs text-muted-foreground">
                  Shown under the title in Google results. Aim for 120–160 characters.
                </p>
                {errors.metaDescription && (
                  <p className="mt-1 text-xs text-destructive">{errors.metaDescription.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/services")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Spinner className="mr-2" />}
              {isEdit ? "Save Changes" : "Add Service"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
