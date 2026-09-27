"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/admin/ui/card"
import { Button } from "@/components/admin/ui/button"
import { Input } from "@/components/admin/ui/input"
import { Label } from "@/components/admin/ui/label"
import { Textarea } from "@/components/admin/ui/textarea"
import {
  Select, SelectContent, SelectItem, SelectSeparator,
  SelectTrigger, SelectValue,
} from "@/components/admin/ui/select"
import type { Faq, FaqStatus } from "@/domain/faq/faq.types"
import { getApiErrorMessage } from "@/lib/api/errors"
import { GENERAL, GENERAL_LABEL, treatmentItems, type ServiceOption } from "./faq-options"
import { faqApiService } from "../_services/faq.api"

const STATUS_ITEMS: Record<FaqStatus, string> = {
  published: "Published (Visible on website)",
  draft: "Draft (Hidden)",
}

export type FaqFormProps = {
  mode: "create" | "edit"
  services: ServiceOption[]
  initialData?: Faq
  /** Pre-selected treatment for a new FAQ (from ?serviceId=) */
  defaultServiceId?: string
  /** Where to go after save / cancel */
  returnTo?: string
}

export function FaqForm({
  mode,
  services,
  initialData,
  defaultServiceId,
  returnTo = "/admin/faqs",
}: FaqFormProps) {
  const router = useRouter()
  const isEdit = mode === "edit"
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    question:     initialData?.question ?? "",
    answer:       initialData?.answer ?? "",
    treatment:    initialData ? (initialData.serviceId ?? GENERAL) : (defaultServiceId ?? GENERAL),
    status:       initialData?.status ?? ("published" as FaqStatus),
    displayOrder: initialData?.displayOrder ?? 1,
  })

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (error) setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const payload = {
        question: form.question.trim(),
        answer: form.answer.trim(),
        serviceId: form.treatment === GENERAL ? null : form.treatment,
        status: form.status,
        displayOrder: Number(form.displayOrder) || 1,
      }

      if (isEdit && initialData?.id) {
        await faqApiService.update(initialData.id, payload)
      } else {
        await faqApiService.create(payload)
      }

      toast.success(isEdit ? "FAQ updated successfully" : "FAQ added successfully")
      router.push(returnTo)
      router.refresh()
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err, "Failed to save FAQ")
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
            {/* Treatment */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="treatment">Treatment</Label>
              <Select
                items={treatmentItems(services)}
                value={form.treatment}
                onValueChange={(v) => set("treatment", v ?? GENERAL)}
              >
                <SelectTrigger id="treatment" aria-label="Select treatment">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false}>
                  <SelectItem value={GENERAL}>{GENERAL_LABEL}</SelectItem>
                  {services.length > 0 && <SelectSeparator />}
                  {services.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                General FAQs show on the home page. Treatment FAQs show on that treatment&apos;s page.
              </p>
            </div>

            {/* Question */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="question">
                Question <span className="text-destructive">*</span>
              </Label>
              <Input
                id="question"
                value={form.question}
                onChange={(e) => set("question", e.target.value)}
                required
              />
            </div>

            {/* Answer */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="answer">
                Answer <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="answer"
                value={form.answer}
                onChange={(e) => set("answer", e.target.value)}
                rows={5}
                required
              />
            </div>

            {/* Display Order */}
            <div className="space-y-1.5">
              <Label htmlFor="displayOrder">Display Order</Label>
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
                items={STATUS_ITEMS}
                value={form.status}
                onValueChange={(v) => set("status", (v ?? "published") as FaqStatus)}
              >
                <SelectTrigger id="status" aria-label="Select status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false}>
                  <SelectItem value="published">{STATUS_ITEMS.published}</SelectItem>
                  <SelectItem value="draft">{STATUS_ITEMS.draft}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(returnTo)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 data-icon="inline-start" className="animate-spin" />}
              {isEdit ? "Save Changes" : "Add FAQ"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
