import * as React from "react";
import { cn } from "@/lib/utils";
import MetaText from "./MetaText";

export interface SectionLabelProps {
  children: React.ReactNode;
  /** "light" = white pill, for sections on a dark background */
  tone?: "dark" | "light";
  /** Classes for the wrapper, e.g. to change the spacing below the label */
  className?: string;
}

// Small rounded pill shown above a section heading, e.g. "ABOUT ILAJ DENTAL CARE".
// The text inside is MetaText, so pills and small uppercase card text always match.
export function SectionLabel({ children, tone = "dark", className }: SectionLabelProps) {
  return (
    <div className={cn("reveal mb-4", className)}>
      <span
        className={cn(
          "inline-flex items-center rounded-full border px-4 py-2",
          tone === "light" ? "border-white bg-white" : "border-zinc-200"
        )}
      >
        <MetaText as="span" className={tone === "light" ? "text-zinc-900" : undefined}>
          {children}
        </MetaText>
      </span>
    </div>
  );
}

export default SectionLabel;
