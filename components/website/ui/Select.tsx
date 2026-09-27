import * as React from "react";
import { cn } from "@/lib/utils";
import { FieldUnderline, fieldControlClass, fieldLabelClass } from "./Input";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  id: string;
}

/**
 * Labelled underline select. Give it a disabled first <option value="">
 * as the placeholder: it shows gray until a real option is picked.
 */
export function Select({ label, id, className, children, ...props }: SelectProps) {
  return (
    <div className={cn("group", className)}>
      <label htmlFor={id} className={fieldLabelClass}>
        {label}
      </label>
      <div className="relative">
        <select id={id} className={cn(fieldControlClass, "h-10 invalid:text-zinc-500")} {...props}>
          {children}
        </select>
        <FieldUnderline />
      </div>
    </div>
  );
}

export default Select;
