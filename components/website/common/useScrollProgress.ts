"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Scroll-scrubbed sections: a tall `track` with a `position: sticky` `stage`
 * inside. Calls `onProgress` with 0 when the stage pins and 1 when it unpins,
 * on every scroll (Lenis drives native scroll, so this stays in sync with it)
 * and resize. Skipped while the track is hidden (display: none).
 */
export function useScrollProgress(
  trackRef: RefObject<HTMLElement | null>,
  stageRef: RefObject<HTMLElement | null>,
  onProgress: (progress: number) => void
) {
  const callback = useRef(onProgress);
  useEffect(() => {
    callback.current = onProgress;
  });

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage) return;

    const update = () => {
      if (!track.offsetParent) return;
      const pinnedAt = parseFloat(getComputedStyle(stage).top) || 0;
      const distance = track.offsetHeight - stage.offsetHeight;
      const progress = distance > 0 ? (pinnedAt - track.getBoundingClientRect().top) / distance : 0;
      callback.current(Math.min(1, Math.max(0, progress)));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [trackRef, stageRef]);
}

export default useScrollProgress;
