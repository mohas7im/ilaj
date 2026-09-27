import * as React from "react";
import { cn } from "@/lib/utils";

/** The centered content width + side padding every section uses. */
export function Container({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}

export interface SectionProps {
  children: React.ReactNode;
  id?: string;
  /** Section-level extras, e.g. a background color (bg-zinc-50) */
  className?: string;
  /** Container-level extras (layout only) */
  containerClassName?: string;
  /**
   * false = no container, for sections with full-width parts (e.g. edge-to-edge
   * bands). Wrap the centered parts in <Container> yourself.
   */
  contained?: boolean;
}

// Every website section uses this wrapper, so top/bottom spacing and the
// centered content width are the same on every page.
export function Section({ children, id, className, containerClassName, contained = true }: SectionProps) {
  return (
    <section
      id={id}
      className={cn("w-full bg-white py-12 text-zinc-950 sm:py-16 lg:py-20", className)}
    >
      {contained ? <Container className={containerClassName}>{children}</Container> : children}
    </section>
  );
}

export default Section;
