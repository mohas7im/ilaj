import * as React from "react";
import { cn } from "@/lib/utils";

export interface MetaTextProps {
  children: React.ReactNode;
  tone?: "dark" | "light";
  as?: "p" | "span";
  /** Layout only (position / margin) — never font size or color */
  className?: string;
}

// Small uppercase text: treatments, qualifications, image chips.
export function MetaText({ children, tone = "dark", as: Tag = "p", className }: MetaTextProps) {
  return (
    <Tag
      className={cn(
        "font-heading text-xs font-medium uppercase tracking-wide",
        tone === "light" ? "text-white" : "text-zinc-800",
        className
      )}
    >
      {children}
    </Tag>
  );
}

export default MetaText;
