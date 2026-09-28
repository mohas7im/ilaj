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
import type { PatientCase } from "@/domain/patient-case/patient-case.types"
import { patientCaseSchema, type PatientCaseInput } from "@/domain/patient-case/patient-case.schema"
import { patientCaseApiService } from "../_services/patient-case.api"
import { getApiErrorMessage } from "@/lib/api/errors"

export type PatientCaseFormProps = {
  mode: "create" | "edit"
  id?: string
}

export function PatientCaseForm({ mode, id }: PatientCaseFormProps) {
  if (mode === "create") return <PatientCaseFormFields mode="create" />
  return <EditPatientCaseForm id={id!} />
}

function EditPatientCaseForm({ id }: { id: string }) {
  const router = useRouter()
  const [initialData, setInitialData] = useState<PatientCase | null>(null)

  useEffect(() => {
    let active = true
    patientCaseApiService
      .getById(id)
      .then((data) => {
        if (active) setInitialData(data)
      })
      .catch((error) => {
        if (!active) return
        toast.error(getApiErrorMessage(error, "Patient case not found"))
        router.push("/admin/gallery/patient")
      })
    return () => {
      active = false
    }
  }, [id, router])

  if (!initialData) {
    return (
      <Card>
        <CardContent>
          <LoadingState spinner label="Loading patient case..." />
        </CardContent>
      </Card>
    )
  }

  return <PatientCaseFormFields mode="edit" initialData={initialData} />
}

function PatientCaseFormFields({
  mode,
  initialData,
}: {
  mode: "create" | "edit"
  initialData?: PatientCase
}) {
  const router = useRouter()
  const isEdit = mode === "edit"
  const beforeFileRef = useRef<HTMLInputElement>(null)
  const afterFileRef = useRef<HTMLInputElement>(null)
  
  const [apiError, setApiError] = useState<string | null>(null)
  const [beforeFile, setBeforeFile] = useState<File | null>(null)
  const [afterFile, setAfterFile] = useState<File | null>(null)
  const [beforePreviewUrl, setBeforePreviewUrl] = useState<string>(initialData?.beforeImage ?? "")
  const [afterPreviewUrl, setAfterPreviewUrl] = useState<string>(initialData?.afterImage ?? "")

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PatientCaseInput>({
    resolver: zodResolver(patientCaseSchema) as any,
    defaultValues: {
      heading: initialData?.heading ?? "",
      description: initialData?.description ?? "",
      beforeImage: initialData?.beforeImage ?? "temp-file",
      afterImage: initialData?.afterImage ?? "temp-file",
      beforeAlt: initialData?.beforeAlt ?? "",
      afterAlt: initialData?.afterAlt ?? "",
      displayOrder: initialData?.displayOrder ?? 1,
    },
  })

  const currentBeforeImage = watch("beforeImage")
  const currentAfterImage = watch("afterImage")

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

    setApiError(null)
    const preview = URL.createObjectURL(file)

    if (key === "beforeImage") {
      setBeforeFile(file)
      setBeforePreviewUrl(preview)
      setValue("beforeImage", "new-upload", { shouldValidate: true })
    } else {
      setAfterFile(file)
      setAfterPreviewUrl(preview)
      setValue("afterImage", "new-upload", { shouldValidate: true })
    }
  }

  const handleRemoveImage = (key: "beforeImage" | "afterImage") => {
    if (key === "beforeImage") {
      setBeforeFile(null)
      setBeforePreviewUrl("")
      setValue("beforeImage", "", { shouldValidate: true })
      if (beforeFileRef.current) beforeFileRef.current.value = ""
    } else {
      setAfterFile(null)
      setAfterPreviewUrl("")
      setValue("afterImage", "", { shouldValidate: true })
      if (afterFileRef.current) afterFileRef.current.value = ""
    }
  }

  const currentBeforeDisplay = beforePreviewUrl || (currentBeforeImage !== "new-upload" && currentBeforeImage !== "temp-file" ? currentBeforeImage : "") || initialData?.beforeImage
  const currentAfterDisplay = afterPreviewUrl || (currentAfterImage !== "new-upload" && currentAfterImage !== "temp-file" ? currentAfterImage : "") || initialData?.afterImage

  const onSubmit = async (data: PatientCaseInput) => {
    setApiError(null)

    if (!beforeFile && (!data.beforeImage || data.beforeImage === "new-upload" || data.beforeImage === "temp-file") && !initialData?.beforeImage) {
      setApiError("Please select a Before photo.")
      return
    }
    if (!afterFile && (!data.afterImage || data.afterImage === "new-upload" || data.afterImage === "temp-file") && !initialData?.afterImage) {
      setApiError("Please select an After photo.")
      return
    }

    try {
      const formData = new FormData()
      formData.append("heading", data.heading)
      formData.append("description", data.description ?? "")
      formData.append("beforeAlt", data.beforeAlt)
      formData.append("afterAlt", data.afterAlt)
      formData.append("displayOrder", String(data.displayOrder))

      if (beforeFile) {
        formData.append("beforeImage", beforeFile)
      } else if (initialData?.beforeImage) {
        formData.append("existingBeforeImage", initialData.beforeImage)
      }

      if (afterFile) {
        formData.append("afterImage", afterFile)
      } else if (initialData?.afterImage) {
        formData.append("existingAfterImage", initialData.afterImage)
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
      setApiError(msg)
      toast.error(msg)
    }
  }

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          {apiError && (
            <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive font-medium">
              {apiError}
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
                {...register("heading")}
                aria-invalid={!!errors.heading}
              />
              {errors.heading && <p className="mt-1 text-xs text-destructive">{errors.heading.message}</p>}
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
                {...register("displayOrder")}
                aria-invalid={!!errors.displayOrder}
              />
              {errors.displayOrder && <p className="mt-1 text-xs text-destructive">{errors.displayOrder.message}</p>}
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
                    alt={watch("beforeAlt") || "Before image preview"}
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
                  disabled={isSubmitting}
                  onChange={(e) => handleImageFile("beforeImage", e)}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isSubmitting}
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
                    disabled={isSubmitting}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleRemoveImage("beforeImage")}
                  >
                    <X className="mr-1 h-3.5 w-3.5" />
                    Remove
                  </Button>
                )}
              </div>
              {errors.beforeImage && <p className="text-xs text-destructive">{errors.beforeImage.message}</p>}

              {/* Before Alt Text */}
              <div className="space-y-1.5 pt-2 border-t border-border/60">
                <Label htmlFor="beforeAlt" className="text-xs">
                  Before Image Alt Text <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="beforeAlt"
                  {...register("beforeAlt")}
                  aria-invalid={!!errors.beforeAlt}
                />
                {errors.beforeAlt && <p className="mt-1 text-xs text-destructive">{errors.beforeAlt.message}</p>}
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
                    alt={watch("afterAlt") || "After image preview"}
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
                  disabled={isSubmitting}
                  onChange={(e) => handleImageFile("afterImage", e)}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isSubmitting}
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
                    disabled={isSubmitting}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleRemoveImage("afterImage")}
                  >
                    <X className="mr-1 h-3.5 w-3.5" />
                    Remove
                  </Button>
                )}
              </div>
              {errors.afterImage && <p className="text-xs text-destructive">{errors.afterImage.message}</p>}

              {/* After Alt Text */}
              <div className="space-y-1.5 pt-2 border-t border-border/60">
                <Label htmlFor="afterAlt" className="text-xs">
                  After Image Alt Text <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="afterAlt"
                  {...register("afterAlt")}
                  aria-invalid={!!errors.afterAlt}
                />
                {errors.afterAlt && <p className="mt-1 text-xs text-destructive">{errors.afterAlt.message}</p>}
              </div>
            </div>
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
              onClick={() => router.push("/admin/gallery/patient")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Spinner className="mr-1.5 size-3.5" />}
              {isEdit ? "Save Changes" : "Add Case"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
