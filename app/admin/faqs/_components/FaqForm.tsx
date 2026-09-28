"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
import { faqSchema, type FaqFormData } from "@/domain/faq/faq.schema"
import type { Faq } from "@/domain/faq/faq.types"
import { getApiErrorMessage } from "@/lib/api/errors"
import { faqApiService } from "../_services/faq.api"

const STATUS_ITEMS = {
  published: "Published (Visible on website)",
  draft: "Draft (Hidden)",
} as const

const RETURN_TO = "/admin/faqs"

export type FaqFormProps = {
  mode: "create" | "edit"
  id?: string
}

export function FaqForm({ mode, id }: FaqFormProps) {
  if (mode === "create") return <FaqFormFields mode="create" />
  return <EditFaqForm id={id!} />
}

function EditFaqForm({ id }: { id: string }) {
  const router = useRouter()
  const [initialData, setInitialData] = useState<Faq | null>(null)

  useEffect(() => {
    let active = true
    faqApiService
      .getById(id)
      .then((data) => {
        if (active) setInitialData(data)
      })
      .catch((error) => {
        if (!active) return
        toast.error(getApiErrorMessage(error, "FAQ not found"))
        router.push(RETURN_TO)
      })
    return () => {
      active = false
    }
  }, [id, router])

  if (!initialData) {
    return (
      <Card>
        <CardContent>
          <LoadingState spinner label="Loading FAQ..." />
        </CardContent>
      </Card>
    )
  }

  return <FaqFormFields mode="edit" initialData={initialData} />
}

function FaqFormFields({
  mode,
  initialData,
}: {
  mode: "create" | "edit"
  initialData?: Faq
}) {
  const router = useRouter()
  const isEdit = mode === "edit"
  const [apiError, setApiError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FaqFormData>({
    resolver: zodResolver(faqSchema) as any,
    defaultValues: {
      question: initialData?.question ?? "",
      answer: initialData?.answer ?? "",
      status: initialData?.status ?? "published",
      displayOrder: initialData?.displayOrder ?? 1,
    },
  })

  const onSubmit = async (data: FaqFormData) => {
    setApiError(null)
    try {
      if (isEdit && initialData?.id) {
        await faqApiService.update(initialData.id, data)
      } else {
        await faqApiService.create(data)
      }
      toast.success(isEdit ? "FAQ updated successfully" : "FAQ added successfully")
      router.push(RETURN_TO)
      router.refresh()
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err, "Failed to save FAQ")
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

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Question */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="question">
                Question <span className="text-destructive">*</span>
              </Label>
              <Input
                id="question"
                {...register("question")}
                aria-invalid={!!errors.question}
              />
              {errors.question && (
                <p className="mt-1 text-xs text-destructive">{errors.question.message}</p>
              )}
            </div>

            {/* Answer */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="answer">
                Answer <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="answer"
                {...register("answer")}
                rows={5}
                aria-invalid={!!errors.answer}
              />
              {errors.answer && (
                <p className="mt-1 text-xs text-destructive">{errors.answer.message}</p>
              )}
            </div>

            {/* Display Order */}
            <div className="space-y-1.5">
              <Label htmlFor="displayOrder">Display Order</Label>
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
                    items={STATUS_ITEMS}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger id="status" aria-label="Select status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent alignItemWithTrigger={false}>
                      <SelectItem value="published">{STATUS_ITEMS.published}</SelectItem>
                      <SelectItem value="draft">{STATUS_ITEMS.draft}</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && (
                <p className="mt-1 text-xs text-destructive">{errors.status.message}</p>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(RETURN_TO)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Spinner className="mr-1.5 size-3.5" />}
              {isEdit ? "Save Changes" : "Add FAQ"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
