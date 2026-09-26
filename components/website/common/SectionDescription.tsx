import * as React from "react";
import { cn } from "@/lib/utils";

export interface SectionDescriptionProps {
  children: React.ReactNode;
  /** "light" = white text, for sections on a dark background */
  tone?: "dark" | "light";
  /** Layout only (width / margin) — never font size or color */
  className?: string;
}

// The one paragraph style for section intros, so all sections match.
export function SectionDescription({ children, tone = "dark", className }: SectionDescriptionProps) {
  return (
    <p
      className={cn(
        "text-base leading-[1.37] lg:text-[16.5px]",
        tone === "light" ? "text-white/90" : "text-zinc-900",
        className
      )}
    >
      {children}
    </p>
  );
}

export default SectionDescription;
