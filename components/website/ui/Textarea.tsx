import * as React from "react";
import { cn } from "@/lib/utils";
import { FieldUnderline, fieldControlClass, fieldLabelClass } from "./Input";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  id: string;
}

/** Labelled underline textarea. `className` is for layout only (e.g. grid span). */
export function Textarea({ label, id, className, ...props }: TextareaProps) {
  return (
    <div className={cn("group", className)}>
      <label htmlFor={id} className={fieldLabelClass}>
        {label}
      </label>
      <div className="relative">
        <textarea id={id} className={cn(fieldControlClass, "h-32 resize-none py-2")} {...props} />
        <FieldUnderline />
      </div>
    </div>
  );
}

export default Textarea;
