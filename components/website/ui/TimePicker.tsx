"use client";

import { useState } from "react";
import { Check, Clock, Moon, Sun, Sunset } from "lucide-react";
import { cn } from "@/lib/utils";
import { PickerField } from "./PickerField";

export interface TimePickerProps {
  id: string;
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
  error?: string;
}

export const TIME_PERIODS = [
  {
    id: "morning",
    label: "Morning",
    range: "9:00 AM – 12:00 PM",
    value: "Morning (9:00 AM – 12:00 PM)",
    icon: Sun,
  },
  {
    id: "afternoon",
    label: "Afternoon",
    range: "12:00 PM – 4:00 PM",
    value: "Afternoon (12:00 PM – 4:00 PM)",
    icon: Sunset,
  },
  {
    id: "evening",
    label: "Evening",
    range: "4:00 PM – 8:00 PM",
    value: "Evening (4:00 PM – 8:00 PM)",
    icon: Moon,
  },
];

/**
 * Clean, compact Time Picker dropdown:
 * Matches the width of the field (w-full), opens downward into the space over notes,
 * and fits in ~110px so it never extends past the bottom or causes scrolling.
 */
export function TimePicker({
  id,
  label,
  name,
  required,
  placeholder = "Select preferred time",
  className,
  error,
}: TimePickerProps) {
  const [time, setTime] = useState("");

  const selectedPeriod = TIME_PERIODS.find((p) => p.value === time);

  return (
    <PickerField
      id={id}
      label={label}
      name={name}
      required={required}
      value={time}
      display={selectedPeriod ? selectedPeriod.value : ""}
      placeholder={placeholder}
      icon={<Clock className="size-4.5" />}
      onReset={() => setTime("")}
      direction="down"
      panelClassName="w-full p-1.5 shadow-xl border border-zinc-200"
      className={className}
      error={error}
    >
      {(close) => (
        <div role="listbox" aria-label={label} className="space-y-1">
          {TIME_PERIODS.map((period) => {
            const selected = period.value === time;
            const Icon = period.icon;
            return (
              <button
                key={period.id}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  setTime(period.value);
                  close();
                }}
                className={cn(
                  "flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-left transition-colors outline-none",
                  selected
                    ? "bg-brand/10 text-brand font-medium"
                    : "hover:bg-zinc-100 text-zinc-900"
                )}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={cn(
                      "size-4 shrink-0",
                      selected ? "text-brand" : "text-zinc-500"
                    )}
                  />
                  <span className="text-sm font-medium truncate">
                    {period.label}
                  </span>
                  <span
                    className={cn(
                      "text-xs shrink-0",
                      selected ? "text-brand/80" : "text-zinc-500"
                    )}
                  >
                    ({period.range})
                  </span>
                </div>
                {selected && (
                  <Check className="size-4 text-brand shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </PickerField>
  );
}

export default TimePicker;
