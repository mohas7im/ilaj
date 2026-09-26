import * as React from "react";
import { cn } from "@/lib/utils";

export interface SectionLabelProps {
  children: React.ReactNode;
  /** "light" = white pill, for sections on a dark background */
  tone?: "dark" | "light";
  /** Classes for the wrapper, e.g. to change the spacing below the label */
  className?: string;
}

// Small rounded pill shown above a section heading, e.g. "ABOUT ILAJ DENTAL CARE".
export function SectionLabel({ children, tone = "dark", className }: SectionLabelProps) {
  return (
    <div className={cn("mb-4", className)}>
      <span
        className={cn(
          "inline-flex items-center rounded-full border px-4 py-2 font-heading text-xs font-medium uppercase tracking-wider",
          tone === "light" ? "border-white bg-white text-zinc-900" : "border-zinc-200 text-zinc-800"
        )}
      >
        {children}
      </span>
    </div>
  );
}

export default SectionLabel;
