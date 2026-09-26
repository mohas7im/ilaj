import * as React from "react";
import { cn } from "@/lib/utils";

export interface SectionLabelProps {
  children: React.ReactNode;
  /** Classes for the wrapper, e.g. to change the spacing below the label */
  className?: string;
}

// Small rounded pill shown above a section heading, e.g. "ABOUT ILAJ DENTAL CARE".
export function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <div className={cn("mb-4 sm:mb-6", className)}>
      <span className="inline-flex items-center rounded-full border border-zinc-200 px-4 py-2 font-heading text-xs font-medium uppercase tracking-wider text-zinc-800">
        {children}
      </span>
    </div>
  );
}

export default SectionLabel;
