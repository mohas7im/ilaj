"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Scroll a snapping strip by one card (plus the 16px `gap-4`). */
export function stepTrack(track: HTMLElement, direction: 1 | -1) {
  const card = track.firstElementChild as HTMLElement | null;
  if (!card) return;
  track.scrollBy({ left: direction * (card.offsetWidth + 16), behavior: "smooth" });
}

/**
 * Arrow state for a horizontal snap strip (doctors, gallery). Attach `trackRef`
 * to the scrolling element; wire `scrollByCard` and `canPrev/canNext` to the
 * ArrowButtons.
 */
export function useSnapCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateArrows = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setCanPrev(track.scrollLeft > 4);
    setCanNext(track.scrollLeft + track.clientWidth < track.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    updateArrows();
    track.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      track.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows]);

  const scrollByCard = useCallback((direction: 1 | -1) => {
    if (trackRef.current) stepTrack(trackRef.current, direction);
  }, []);

  return { trackRef, canPrev, canNext, scrollByCard };
}
