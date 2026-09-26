import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardTextProps {
  children: React.ReactNode;
  tone?: "dark" | "light";
  as?: "p" | "span" | "div";
  /** Layout only (width / margin) — never font size or color */
  className?: string;
}

// The one body-text style inside cards, lists and info blocks.
export function CardText({ children, tone = "dark", as: Tag = "p", className }: CardTextProps) {
  return (
    <Tag
      className={cn(
        "text-[15px] leading-[1.4]",
        tone === "light" ? "text-white/90" : "text-zinc-800",
        className
      )}
    >
      {children}
    </Tag>
  );
}

export default CardText;
