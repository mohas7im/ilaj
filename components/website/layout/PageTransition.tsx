"use client";

import { ViewTransition } from "react";
import { usePathname } from "next/navigation";

// Keyed by path so each navigation exits the old page and enters the new one
// (animations: .page-out / .page-in in styles/website/theme.css). Named
// <ViewTransition>s inside, like the service image, morph between pages.
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <ViewTransition key={pathname} enter="page-in" exit="page-out" default="none">
      <div className="flex-1">{children}</div>
    </ViewTransition>
  );
}
