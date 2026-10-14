"use client";

import { useEffect } from "react";

// Eased mouse-wheel scrolling for the website. Anchor links are smoothed too,
// offset by the fixed h-20 navbar. Skipped for prefers-reduced-motion users and
// touch devices (Lenis doesn't smooth touch scrolling), so phones never download it.
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let lenis: { destroy(): void } | null = null;
    let cancelled = false;

    Promise.all([import("lenis"), import("lenis/dist/lenis.css")]).then(([{ default: Lenis }]) => {
      if (cancelled) return;
      lenis = new Lenis({
        lerp: 0.08,
        wheelMultiplier: 1,
        autoRaf: true,
        anchors: { offset: -80 },
      });
    });

    return () => {
      cancelled = true;
      lenis?.destroy();
    };
  }, []);

  return null;
}
