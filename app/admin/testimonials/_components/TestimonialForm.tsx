"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm, Controller, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Star } from "lucide-react"
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
import { Spinner } from "@/components/admin/ui/spinner"
import type { Testimonial } from "@/domain/testimonial/testimonial.types"
import { testimonialSchema, type TestimonialFormData } from "@/domain/testimonial/testimonial.schema"
import { testimonialApiService } from "../_services/testimonial.api"
import { getApiErrorMessage } from "@/lib/api/errors"

export type TestimonialFormProps = {
  mode: "create" | "edit"
  id?: string
}

export function TestimonialForm({ mode, id }: TestimonialFormProps) {
  if (mode === "create") return <TestimonialFormFields mode="create" />
  return <EditTestimonialForm id={id!} />
}

function EditTestimonialForm({ id }: { id: string }) {
  const router = useRouter()
  const [initialData, setInitialData] = useState<Testimonial | null>(null)

  useEffect(() => {
    let active = true
    testimonialApiService
      .getById(id)
      .then((data) => {
        if (active) setInitialData(data)
      })
      .catch((error) => {
        if (!active) return
        toast.error(getApiErrorMessage(error, "Testimonial not found"))
        router.push("/admin/testimonials")
      })
    return () => {
      active = false
    }
  }, [id, router])

  if (!initialData) {
    return (
      <Card>
        <CardContent>
          <LoadingState spinner label="Loading testimonial..." />
        </CardContent>
      </Card>
    )
  }

  return <TestimonialFormFields mode="edit" initialData={initialData} />
}

function TestimonialFormFields({
  mode,
  initialData,
}: {
  mode: "create" | "edit"
  initialData?: Testimonial
}) {
  const router = useRouter()
  const isEdit = mode === "edit"

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<TestimonialFormData>({
    resolver: zodResolver(testimonialSchema) as any,
    defaultValues: {
      patientName: initialData?.patientName ?? "",
      treatment: initialData?.treatment ?? "",
      rating: initialData?.rating ?? 5,
      review: initialData?.review ?? "",
      status: initialData?.status ?? "published",
      displayOrder: initialData?.displayOrder ?? 1,
    },
  })

  // Watch rating to update the visual star indicator live
  const ratingValue = useWatch({ control, name: "rating" })

  const onSubmit = async (data: TestimonialFormData) => {
    try {
      if (isEdit && initialData?.id) {
        await testimonialApiService.update(initialData.id, data)
      } else {
        await testimonialApiService.create(data)
      }
      toast.success(isEdit ? "Testimonial updated successfully" : "Testimonial added successfully")
      router.push("/admin/testimonials")
      router.refresh()
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err, "Failed to save testimonial")
      toast.error(msg)
    }
  }

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Patient Name */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="patientName">
                Patient Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="patientName"
                {...register("patientName")}
                aria-invalid={!!errors.patientName}
              />
              {errors.patientName && (
                <p className="mt-1 text-xs text-destructive">{errors.patientName.message}</p>
              )}
            </div>

            {/* Treatment / Service */}
            <div className="space-y-1.5">
              <Label htmlFor="treatment">
                Treatment / Service <span className="text-destructive">*</span>
              </Label>
              <Input
                id="treatment"
                {...register("treatment")}
                aria-invalid={!!errors.treatment}
              />
              {errors.treatment && (
                <p className="mt-1 text-xs text-destructive">{errors.treatment.message}</p>
              )}
            </div>

            {/* Rating */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="rating">
                  Rating (out of 5) <span className="text-destructive">*</span>
                </Label>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="h-3.5 w-3.5 fill-red-500 text-red-500" />
                  <span>{ratingValue || "5"}/5</span>
                </div>
              </div>
              <Input
                id="rating"
                type="number"
                step="0.1"
                min="1"
                max="5"
                {...register("rating")}
                aria-invalid={!!errors.rating}
              />
              {errors.rating && (
                <p className="mt-1 text-xs text-destructive">{errors.rating.message}</p>
              )}
            </div>

            {/* Display Order */}
            <div className="space-y-1.5">
              <Label htmlFor="displayOrder">
                Display Order
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

            {/* Status */}
            <div className="space-y-1.5">
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
                    <SelectContent alignItemWithTrigger={false} className="min-w-[280px]">
                      <SelectItem value="published">Published (Visible on website)</SelectItem>
                      <SelectItem value="draft">Draft (Hidden)</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && (
                <p className="mt-1 text-xs text-destructive">{errors.status.message}</p>
              )}
            </div>

            {/* Review / Feedback Quote */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="review">
                Patient Feedback Quote <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="review"
                {...register("review")}
                rows={4}
                aria-invalid={!!errors.review}
              />
              {errors.review && (
                <p className="mt-1 text-xs text-destructive">{errors.review.message}</p>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/testimonials")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Spinner className="mr-2" />}
              {isEdit ? "Save Changes" : "Add Testimonial"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
