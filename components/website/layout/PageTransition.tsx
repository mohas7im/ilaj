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
      {/* Sits above the footer with a solid background; the footer tucks
          underneath and its content rises out from behind it (see Footer.tsx). */}
      <div className="relative z-10 flex-1 bg-white">{children}</div>
    </ViewTransition>
  );
}
