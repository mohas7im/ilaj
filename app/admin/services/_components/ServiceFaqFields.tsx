"use client"

import { useRef, useState } from "react"
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/admin/ui/button"
import { Input } from "@/components/admin/ui/input"
import { Label } from "@/components/admin/ui/label"
import { Textarea } from "@/components/admin/ui/textarea"
import type { ServiceFaq } from "@/domain/service/service.types"

/** One editable FAQ row; `key` keeps React state stable while reordering. */
export type ServiceFaqRow = { key: string; question: string; answer: string }

export function toServiceFaqRows(faqs: ServiceFaq[] = []): ServiceFaqRow[] {
  return faqs.map((faq) => ({ key: faq.id, question: faq.question, answer: faq.answer }))
}

type ServiceFaqFieldsProps = {
  rows: ServiceFaqRow[]
  onChange: (rows: ServiceFaqRow[]) => void
}

// Treatment FAQs, edited inline and saved with the service.
// List order = display order on the website.
export function ServiceFaqFields({ rows, onChange }: ServiceFaqFieldsProps) {
  const nextKey = useRef(0)
  const [focusKey, setFocusKey] = useState<string | null>(null)

  const update = (key: string, field: "question" | "answer", value: string) =>
    onChange(rows.map((row) => (row.key === key ? { ...row, [field]: value } : row)))

  const move = (index: number, by: -1 | 1) => {
    const next = [...rows]
    ;[next[index], next[index + by]] = [next[index + by], next[index]]
    onChange(next)
  }

  const add = () => {
    const key = `new-${nextKey.current++}`
    setFocusKey(key)
    onChange([...rows, { key, question: "", answer: "" }])
  }

  return (
    <div className="space-y-3 pt-2">
      <div>
        <Label className="text-sm font-semibold">FAQs</Label>
        <p className="text-xs text-muted-foreground">
          Shown on this treatment&apos;s page. The FAQ section is hidden when there are none.
        </p>
      </div>

      {rows.length > 0 && (
        <ol className="space-y-3">
          {rows.map((row, index) => {
            const n = index + 1
            return (
              <li key={row.key} className="space-y-2 rounded-lg border p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-muted-foreground">Question {n}</span>
                  <div className="flex items-center gap-0.5">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      title="Move up"
                      aria-label={`Move question ${n} up`}
                      disabled={index === 0}
                      onClick={() => move(index, -1)}
                    >
                      <ArrowUp />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      title="Move down"
                      aria-label={`Move question ${n} down`}
                      disabled={index === rows.length - 1}
                      onClick={() => move(index, 1)}
                    >
                      <ArrowDown />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      title="Remove"
                      aria-label={`Remove question ${n}`}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => onChange(rows.filter((r) => r.key !== row.key))}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </div>
                <Input
                  value={row.question}
                  onChange={(e) => update(row.key, "question", e.target.value)}
                  placeholder="Question"
                  aria-label={`Question ${n}`}
                  autoFocus={row.key === focusKey}
                />
                <Textarea
                  value={row.answer}
                  onChange={(e) => update(row.key, "answer", e.target.value)}
                  placeholder="Answer"
                  aria-label={`Answer ${n}`}
                  rows={3}
                />
              </li>
            )
          })}
        </ol>
      )}

      <Button type="button" variant="outline" onClick={add}>
        <Plus data-icon="inline-start" aria-hidden="true" />
        Add question
      </Button>
    </div>
  )
}
