import * as React from "react";
import { cn } from "@/lib/utils";
import { FieldUnderline, fieldControlClass, fieldControlErrorClass, fieldLabelClass, fieldLabelErrorClass } from "./Input";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  id: string;
  error?: string;
  textareaClassName?: string;
}

/** Labelled underline textarea. `className` is for layout only (e.g. grid span). */
export function Textarea({ label, id, className, textareaClassName, error, ...props }: TextareaProps) {
  return (
    <div className={cn("group", className)}>
      <label htmlFor={id} className={error ? fieldLabelErrorClass : fieldLabelClass}>
        {label}
      </label>
      <div className="relative">
        <textarea
          id={id}
          className={cn(error ? fieldControlErrorClass : fieldControlClass, "h-32 resize-none py-2", textareaClassName)}
          {...props}
        />
        <FieldUnderline hasError={!!error} />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default Textarea;
