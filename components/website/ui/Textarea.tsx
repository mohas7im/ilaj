import * as React from "react";
import { cn } from "@/lib/utils";
import { fieldControlClass, fieldLabelClass } from "./Input";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  id: string;
}

/** Labelled underline textarea. `className` is for layout only (e.g. grid span). */
export function Textarea({ label, id, className, ...props }: TextareaProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className={fieldLabelClass}>
        {label}
      </label>
      <textarea id={id} className={cn(fieldControlClass, "h-16 resize-none py-2")} {...props} />
    </div>
  );
}

export default Textarea;
