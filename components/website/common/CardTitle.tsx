import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardTitleProps {
  children: React.ReactNode;
  /** "md" = 24px card/list title, "sm" = 18px names, info labels, ratings */
  size?: "md" | "sm";
  tone?: "dark" | "brand" | "light";
  as?: "h2" | "h3" | "h4" | "span";
  /** Layout only (width / margin) — never font size or color */
  className?: string;
}

// The one title style inside cards and lists (below SectionTitle in the scale).
export function CardTitle({ children, size = "md", tone = "dark", as: Tag = "h3", className }: CardTitleProps) {
  return (
    <Tag
      className={cn(
        "font-heading font-medium tracking-tight",
        size === "md" ? "text-2xl leading-tight" : "text-lg leading-snug",
        tone === "brand" && "text-brand",
        tone === "light" && "text-white",
        tone === "dark" && "text-zinc-950",
        className
      )}
    >
      {children}
    </Tag>
  );
}

export default CardTitle;
