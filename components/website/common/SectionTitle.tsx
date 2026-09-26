import * as React from "react";
import { cn } from "@/lib/utils";

export interface SectionTitleProps {
  children: React.ReactNode;
  /** "light" = white text, for sections on a dark background */
  tone?: "dark" | "light";
  /** Heading level; the look stays the same */
  as?: "h1" | "h2" | "h3";
  /** Layout only (width / margin) — never font size or color */
  className?: string;
}

// The one heading style every website section uses, so all sections match.
// Wrap the red part in <Highlight>:
//   <SectionTitle>What Makes Ilaj <br /> <Highlight>Dental Care Different</Highlight></SectionTitle>
export function SectionTitle({ children, tone = "dark", as: Tag = "h2", className }: SectionTitleProps) {
  return (
    <Tag
      className={cn(
        "font-heading text-3xl font-medium leading-[1.1] tracking-tight sm:text-4xl lg:text-[38px]",
        tone === "light" ? "text-white" : "text-zinc-950",
        className
      )}
    >
      {children}
    </Tag>
  );
}

/** Brand-red words inside a SectionTitle. */
export function Highlight({ children }: { children: React.ReactNode }) {
  return <span className="text-brand">{children}</span>;
}

export default SectionTitle;
