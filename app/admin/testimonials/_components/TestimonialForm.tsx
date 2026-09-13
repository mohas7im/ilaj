"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/admin/ui/card"
import { Button } from "@/components/admin/ui/button"
import { Input } from "@/components/admin/ui/input"
import { Label } from "@/components/admin/ui/label"
import { Textarea } from "@/components/admin/ui/textarea"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/admin/ui/select"
import type { Testimonial, TestimonialStatus } from "../_types/testimonial.types"

export type TestimonialFormProps = {
  mode: "create" | "edit"
  initialData?: Testimonial
}

export function TestimonialForm({ mode, initialData }: TestimonialFormProps) {
  const router = useRouter()
  const isEdit = mode === "edit"

  const [form, setForm] = useState({
    patientName: initialData?.patientName ?? "",
    treatment:   initialData?.treatment   ?? "",
    rating:      initialData ? String(initialData.rating) : "5",
    review:      initialData?.review      ?? "",
    status:      initialData?.status      ?? ("published" as TestimonialStatus),
  })

  const set = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = {
        ...form,
        rating: parseFloat(form.rating) || 5,
      }
      if (isEdit && initialData?.id) {
        await fetch(`/api/testimonials/${initialData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      } else {
        await fetch("/api/testimonials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      }
    } catch {
      // Fallback
    }
    router.push("/admin/testimonials")
  }

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
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
                placeholder="e.g. Mohammed Adil"
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
                placeholder="e.g. Root Canal Treatment"
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
                placeholder="e.g. 4.5"
                required
              />
            </div>

            {/* Status */}
            <div className="space-y-1.5 sm:col-span-2">
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
                placeholder="e.g. I was nervous about the root canal, but it was easier than expected. The doctor explained each step and ensured my comfort."
                rows={4}
                required
              />
            </div>
          </div>


          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/testimonials")}>
              Cancel
            </Button>
            <Button type="submit">
              {isEdit ? "Save Changes" : "Add Testimonial"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
