"use client";

import { ArrowUp } from "lucide-react";

// Footer is a Server Component (it awaits settings data), so the one
// interactive bit — smooth-scrolling back up — is split out into its own
// tiny client island instead of making the whole footer client-rendered.
export default function BackToTopButton() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="group inline-flex items-center gap-1.5 font-heading text-xs font-medium uppercase tracking-wider text-white/60 transition-colors duration-200 hover:text-white"
    >
      Back to top
      <ArrowUp
        aria-hidden="true"
        className="size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5"
      />
    </button>
  );
}
