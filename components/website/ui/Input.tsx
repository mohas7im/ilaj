import * as React from "react";
import { cn } from "@/lib/utils";

// Shared look for every website form field (Input, Select, Textarea).
// The field wrapper is a `group`, so the label turns brand red while focused.
export const fieldLabelClass =
  "block text-sm text-zinc-950 transition-colors duration-200 group-focus-within:text-brand";
export const fieldControlClass =
  "peer mt-2 block w-full border-0 border-b border-zinc-300 bg-transparent px-0 text-sm text-zinc-950 outline-none transition-colors placeholder:text-zinc-500";

/** Brand-red line that grows from the left under a focused field. Place right after the control. */
export function FieldUnderline() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-brand transition-transform duration-300 ease-out peer-focus:scale-x-100 motion-reduce:transition-none"
    />
  );
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

/** Labelled underline input. `className` is for layout only (e.g. grid span). */
export function Input({ label, id, className, ...props }: InputProps) {
  return (
    <div className={cn("group", className)}>
      <label htmlFor={id} className={fieldLabelClass}>
        {label}
      </label>
      <div className="relative">
        <input id={id} className={cn(fieldControlClass, "h-10")} {...props} />
        <FieldUnderline />
      </div>
    </div>
  );
}

export default Input;
