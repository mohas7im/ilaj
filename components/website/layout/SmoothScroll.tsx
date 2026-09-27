"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

// Eased mouse-wheel scrolling for the website. Anchor links are smoothed too,
// offset by the fixed h-20 navbar. Skipped for prefers-reduced-motion users.
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.15,
      wheelMultiplier: 1,
      autoRaf: true,
      anchors: { offset: -80 },
    });

    return () => lenis.destroy();
  }, []);

  return null;
}
