import * as React from "react";
import { cn } from "@/lib/utils";

// Shared look for every website form field (Input, Select, Textarea).
// The field wrapper is a `group`, so the label turns brand red while focused.
export const fieldLabelClass =
  "block text-sm text-zinc-950 transition-colors duration-200 group-focus-within:text-brand";
export const fieldLabelErrorClass =
  "block text-sm text-red-500 transition-colors duration-200";
export const fieldControlClass =
  "peer mt-2 block w-full border-0 border-b border-zinc-300 bg-transparent px-0 text-sm text-zinc-950 outline-none transition-colors placeholder:text-zinc-500";
export const fieldControlErrorClass =
  "peer mt-2 block w-full border-0 border-b border-red-400 bg-transparent px-0 text-sm text-zinc-950 outline-none transition-colors placeholder:text-zinc-500";


/** Brand-red line that grows from the left under a focused field. Place right after the control. */
export function FieldUnderline({ hasError }: { hasError?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={hasError
        ? "pointer-events-none absolute inset-x-0 bottom-0 h-0.5 bg-red-400"
        : "pointer-events-none absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-brand transition-transform duration-300 ease-out peer-focus:scale-x-100 peer-aria-expanded:scale-x-100 motion-reduce:transition-none"
      }
    />
  );
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
}

/** Labelled underline input. `className` is for layout only (e.g. grid span). */
export function Input({ label, id, className, error, ...props }: InputProps) {
  return (
    <div className={cn("group", className)}>
      <label htmlFor={id} className={error ? fieldLabelErrorClass : fieldLabelClass}>
        {label}
      </label>
      <div className="relative">
        <input id={id} className={cn(error ? fieldControlErrorClass : fieldControlClass, "h-10")} {...props} />
        <FieldUnderline hasError={!!error} />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default Input;
