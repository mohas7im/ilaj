import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardTextProps {
  children: React.ReactNode;
  tone?: "dark" | "light";
  /** "md" = 16px (default), "sm" = 14px for compact cards like testimonials */
  size?: "md" | "sm";
  as?: "p" | "span" | "div";
  /** Layout only (width / margin) — never font size or color */
  className?: string;
}

// The one body-text style inside cards, lists and info blocks.
export function CardText({ children, tone = "dark", size = "md", as: Tag = "p", className }: CardTextProps) {
  return (
    <Tag
      className={cn(
        size === "sm" ? "text-sm" : "text-base",
        tone === "light" ? "text-white/90" : "text-zinc-800",
        className
      )}
    >
      {children}
    </Tag>
  );
}

export default CardText;
