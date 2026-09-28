"use client";

import { useState } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { PickerField } from "./PickerField";

export interface TimePickerProps {
  id: string;
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  /** First and last bookable slot, "HH:MM" 24h (default: clinic hours 9 AM–8 PM) */
  from?: string;
  to?: string;
  /** Minutes between slots */
  step?: number;
  /** Layout only (e.g. grid span) */
  className?: string;
  error?: string;
}

const toMinutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const toValue = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

const toLabel = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = String(minutes % 60).padStart(2, "0");
  return `${h % 12 || 12}:${m} ${h < 12 ? "AM" : "PM"}`;
};

/**
 * Time field: click the field to open a panel of time slots within opening
 * hours. Submits "HH:MM" (24h), like a native time input.
 */
export function TimePicker({
  id,
  label,
  name,
  required,
  placeholder = "Select a time",
  from = "09:00",
  to = "19:30",
  step = 30,
  className,
  error,
}: TimePickerProps) {
  const [time, setTime] = useState("");

  const slots: number[] = [];
  for (let minutes = toMinutes(from); minutes <= toMinutes(to); minutes += step) slots.push(minutes);

  return (
    <PickerField
      id={id}
      label={label}
      name={name}
      required={required}
      value={time}
      display={time ? toLabel(toMinutes(time)) : ""}
      placeholder={placeholder}
      icon={<Clock className="size-4.5" />}
      onReset={() => setTime("")}
      panelClassName="w-[min(22rem,calc(100vw-3rem))] p-3"
      className={className}
      error={error}
    >
      {(close) => (
        <div role="group" aria-label={label} className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {slots.map((minutes, index) => {
            const value = toValue(minutes);
            const selected = value === time;
            return (
              <button
                key={value}
                type="button"
                autoFocus={selected || (!time && index === 0)}
                aria-pressed={selected}
                onClick={() => {
                  setTime(value);
                  close();
                }}
                className={cn(
                  "cursor-pointer rounded-full border px-2 py-2 text-xs font-medium transition-colors",
                  selected
                    ? "border-brand bg-brand text-white"
                    : "border-zinc-200 text-zinc-800 hover:border-brand hover:text-brand"
                )}
              >
                {toLabel(minutes)}
              </button>
            );
          })}
        </div>
      )}
    </PickerField>
  );
}

export default TimePicker;
