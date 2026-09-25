"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Star, Loader2 } from "lucide-react"
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
import type { Testimonial, TestimonialStatus } from "@/domain/testimonial/testimonial.types"
import { testimonialApiService } from "../_services/testimonial.api"
import { getApiErrorMessage } from "@/lib/api/errors"

export type TestimonialFormProps = {
  mode: "create" | "edit"
  initialData?: Testimonial
}

export function TestimonialForm({ mode, initialData }: TestimonialFormProps) {
  const router = useRouter()
  const isEdit = mode === "edit"
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    patientName:  initialData?.patientName  ?? "",
    treatment:    initialData?.treatment    ?? "",
    rating:       initialData ? String(initialData.rating) : "5",
    review:       initialData?.review       ?? "",
    status:       initialData?.status       ?? ("published" as TestimonialStatus),
    displayOrder: initialData?.displayOrder ?? 1,
  })

  const set = (key: keyof typeof form, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (error) setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const payload = {
        patientName: form.patientName.trim(),
        treatment: form.treatment.trim(),
        rating: parseFloat(String(form.rating)) || 5,
        review: form.review.trim(),
        status: form.status,
        displayOrder: Number(form.displayOrder) || 1,
      }

      if (isEdit && initialData?.id) {
        await testimonialApiService.update(initialData.id, payload)
      } else {
        await testimonialApiService.create(payload)
      }

      toast.success(isEdit ? "Testimonial updated successfully" : "Testimonial added successfully")
      router.push("/admin/testimonials")
      router.refresh()
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err, "Failed to save testimonial")
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

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Patient Name */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="patientName">
                Patient Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="patientName"
                value={form.patientName}
                onChange={(e) => set("patientName", e.target.value)}
                required
              />
            </div>

            {/* Treatment / Service */}
            <div className="space-y-1.5">
              <Label htmlFor="treatment">
                Treatment / Service <span className="text-destructive">*</span>
              </Label>
              <Input
                id="treatment"
                value={form.treatment}
                onChange={(e) => set("treatment", e.target.value)}
                required
              />
            </div>

            {/* Rating */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="rating">
                  Rating (out of 5) <span className="text-destructive">*</span>
                </Label>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="h-3.5 w-3.5 fill-red-500 text-red-500" />
                  <span>{form.rating || "5"}/5</span>
                </div>
              </div>
              <Input
                id="rating"
                type="number"
                step="0.1"
                min="1"
                max="5"
                value={form.rating}
                onChange={(e) => set("rating", e.target.value)}
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

            {/* Status */}
            <div className="space-y-1.5">
              <Label htmlFor="status">Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => set("status", (v ?? "published") as TestimonialStatus)}
              >
                <SelectTrigger id="status" className="w-full" aria-label="Select status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="min-w-[280px]">
                  <SelectItem value="published">Published (Visible on website)</SelectItem>
                  <SelectItem value="draft">Draft (Hidden)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Review / Feedback Quote */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="review">
                Patient Feedback Quote <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="review"
                value={form.review}
                onChange={(e) => set("review", e.target.value)}
                rows={4}
                required
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/testimonials")}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? "Save Changes" : "Add Testimonial"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
