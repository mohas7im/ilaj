"use client"

import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import { format, parseISO, subDays } from "date-fns"
import type { DateRange } from "react-day-picker"
import { Button } from "@/components/admin/ui/button"
import { Calendar } from "@/components/admin/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/admin/ui/popover"
import { Tabs, TabsList, TabsTrigger } from "@/components/admin/ui/tabs"
import type { AnalyticsDateRange } from "../_types/analytics.types"

export const PRESETS = [7, 28, 90] as const
export type Preset = (typeof PRESETS)[number]

const toYmd = (d: Date) => format(d, "yyyy-MM-dd")

/** Last `days` days including today, in the admin's local time. */
export function presetRange(days: Preset): AnalyticsDateRange {
  const today = new Date()
  return { start: toYmd(subDays(today, days - 1)), end: toYmd(today) }
}

type DateRangeControlsProps = {
  preset: Preset | null
  range: AnalyticsDateRange
  disabled?: boolean
  onPresetChange: (preset: Preset) => void
  onCustomChange: (range: AnalyticsDateRange) => void
}

export function DateRangeControls({
  preset,
  range,
  disabled,
  onPresetChange,
  onCustomChange,
}: DateRangeControlsProps) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<DateRange | undefined>()

  const label = (ymd: string) => format(parseISO(ymd), "d MMM yyyy")

  function apply() {
    if (!draft?.from) return
    onCustomChange({ start: toYmd(draft.from), end: toYmd(draft.to ?? draft.from) })
    setOpen(false)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Tabs value={preset ?? "custom"} onValueChange={(v) => onPresetChange(v as Preset)}>
        <TabsList>
          {PRESETS.map((days) => (
            <TabsTrigger key={days} value={days} disabled={disabled}>
              {days} days
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Popover
        open={open}
        onOpenChange={(next) => {
          setOpen(next)
          if (next) setDraft({ from: parseISO(range.start), to: parseISO(range.end) })
        }}
      >
        <PopoverTrigger
          render={
            <Button
              variant={preset === null ? "default" : "outline"}
              size="sm"
              className="font-normal"
              disabled={disabled}
            />
          }
        >
          <CalendarIcon data-icon="inline-start" aria-hidden="true" />
          {preset === null ? `${label(range.start)} – ${label(range.end)}` : "Custom range"}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            numberOfMonths={2}
            selected={draft}
            onSelect={setDraft}
            defaultMonth={draft?.from}
            disabled={{ after: new Date() }}
          />
          <div className="flex items-center justify-end gap-2 border-t p-3">
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={apply} disabled={!draft?.from}>
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
