"use client";

import * as React from "react";
import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { PickerField } from "./PickerField";

export interface SelectProps {
  id: string;
  label: string;
  name: string;
  options: string[];
  required?: boolean;
  placeholder?: string;
  /** Layout only (e.g. grid span) */
  className?: string;
}

/**
 * Custom dropdown in the website field style: click anywhere on the field to
 * open the list. Arrow keys move between options, Enter picks, Escape closes.
 */
export function Select({ id, label, name, options, required, placeholder = "Choose an option", className }: SelectProps) {
  const [value, setValue] = useState("");

  // Arrow-key navigation between the option buttons
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const buttons = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>("[role=option]"));
    const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
    const next = e.key === "ArrowDown" ? Math.min(buttons.length - 1, index + 1) : Math.max(0, index - 1);
    buttons[next]?.focus();
  };

  return (
    <PickerField
      id={id}
      label={label}
      name={name}
      required={required}
      value={value}
      display={value}
      placeholder={placeholder}
      icon={<ChevronDown className="size-4.5" />}
      onReset={() => setValue("")}
      popupRole="listbox"
      panelClassName="w-full p-1.5"
      className={className}
    >
      {(close) => (
        <div role="listbox" aria-label={label} onKeyDown={onKeyDown} className="max-h-64 overflow-y-auto">
          {options.map((option, index) => {
            const selected = option === value;
            return (
              <button
                key={option}
                type="button"
                role="option"
                aria-selected={selected}
                autoFocus={selected || (!value && index === 0)}
                onClick={() => {
                  setValue(option);
                  close();
                }}
                className={cn(
                  "flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors outline-none hover:bg-zinc-100 focus-visible:bg-zinc-100",
                  selected ? "font-medium text-brand" : "text-zinc-900"
                )}
              >
                {option}
                {selected && <Check aria-hidden="true" className="size-4" />}
              </button>
            );
          })}
        </div>
      )}
    </PickerField>
  );
}

export default Select;
