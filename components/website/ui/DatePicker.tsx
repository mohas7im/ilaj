"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { format, startOfDay } from "date-fns";
import { CalendarDays } from "lucide-react";
import { PickerField } from "./PickerField";

export interface DatePickerProps {
  id: string;
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  /** Layout only (e.g. grid span) */
  className?: string;
}

/**
 * Date field with a site-styled calendar: click anywhere on the field to open
 * it. Past days and Sundays (clinic closed) can't be picked. Submits
 * "yyyy-MM-dd", like a native date input.
 */
export function DatePicker({ id, label, name, required, placeholder = "Select a date", className }: DatePickerProps) {
  const [date, setDate] = useState<Date | undefined>();

  return (
    <PickerField
      id={id}
      label={label}
      name={name}
      required={required}
      value={date ? format(date, "yyyy-MM-dd") : ""}
      display={date ? format(date, "EEE, d MMM yyyy") : ""}
      placeholder={placeholder}
      icon={<CalendarDays className="size-4.5" />}
      onReset={() => setDate(undefined)}
      panelClassName="p-4"
      className={className}
    >
      {(close) => (
        <DayPicker
          mode="single"
          autoFocus
          selected={date}
          onSelect={(day) => {
            setDate(day);
            if (day) close();
          }}
          defaultMonth={date}
          startMonth={new Date()}
          disabled={[{ before: startOfDay(new Date()) }, { dayOfWeek: [0] }]}
          weekStartsOn={1}
          showOutsideDays
          classNames={{
            root: "relative text-sm",
            months: "relative",
            month: "space-y-3",
            month_caption: "flex h-9 items-center px-1",
            caption_label: "font-heading text-base font-medium text-zinc-950",
            nav: "absolute right-0 top-0 z-10 flex gap-1",
            button_previous:
              "flex size-9 cursor-pointer items-center justify-center rounded-full text-zinc-700 transition-colors hover:bg-zinc-100 disabled:cursor-default disabled:opacity-30",
            button_next:
              "flex size-9 cursor-pointer items-center justify-center rounded-full text-zinc-700 transition-colors hover:bg-zinc-100 disabled:cursor-default disabled:opacity-30",
            chevron: "size-4 fill-current",
            month_grid: "border-collapse",
            weekday: "size-10 text-xs font-medium uppercase text-zinc-500",
            day: "group/day p-0.5 text-center",
            day_button: [
              "size-9 cursor-pointer rounded-full text-sm text-zinc-900 transition-colors hover:bg-zinc-100",
              "group-data-[today=true]/day:ring-1 group-data-[today=true]/day:ring-brand",
              "group-data-[selected=true]/day:bg-brand group-data-[selected=true]/day:text-white group-data-[selected=true]/day:hover:bg-brand-hover",
              "group-data-[outside=true]/day:text-zinc-300",
              "group-data-[disabled=true]/day:cursor-not-allowed group-data-[disabled=true]/day:text-zinc-300 group-data-[disabled=true]/day:hover:bg-transparent",
            ].join(" "),
          }}
        />
      )}
    </PickerField>
  );
}

export default DatePicker;
