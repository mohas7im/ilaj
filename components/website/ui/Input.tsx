import * as React from "react";
import { cn } from "@/lib/utils";

// Shared look for every website form field (Input, Select, Textarea).
export const fieldLabelClass = "block text-[15px] leading-5 text-zinc-950";
export const fieldControlClass =
  "mt-2 w-full border-0 border-b border-[#bbbbbb] bg-transparent px-0 text-sm text-zinc-950 outline-none transition-colors placeholder:text-zinc-500 focus:border-brand";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

/** Labelled underline input. `className` is for layout only (e.g. grid span). */
export function Input({ label, id, className, ...props }: InputProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className={fieldLabelClass}>
        {label}
      </label>
      <input id={id} className={cn(fieldControlClass, "h-10")} {...props} />
    </div>
  );
}

export default Input;
