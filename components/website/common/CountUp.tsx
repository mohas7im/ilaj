"use client";

import { useEffect, useRef, useState } from "react";

export interface CountUpProps {
  /** Display value such as "10+", "5000+" or "99%". The number counts up; prefix/suffix stay put. */
  value: string;
  /** Animation length in ms */
  duration?: number;
}

// Counts from 0 to the number inside `value` the first time it scrolls into view.
// Non-numeric values render as-is; reduced-motion users see the final value.
export function CountUp({ value, duration = 2000 }: CountUpProps) {
  const match = value.match(/^(\D*)([\d,]+)(.*)$/);
  const target = match ? Number(match[2].replace(/,/g, "")) : 0;
  const useCommas = match ? match[2].includes(",") : false;
  const hasNumber = match !== null;

  const ref = useRef<HTMLSpanElement>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!hasNumber || !el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCurrent(target);
      return;
    }

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
          setCurrent(Math.round(eased * target));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.5 }
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [hasNumber, target, duration]);

  if (!match) return <>{value}</>;

  const [, prefix, , suffix] = match;
  const number = useCommas ? current.toLocaleString("en-US") : String(current);

  return (
    <>
      <span ref={ref} aria-hidden="true" className="tabular-nums">
        {prefix}
        {number}
        {suffix}
      </span>
      <span className="sr-only">{value}</span>
    </>
  );
}

export default CountUp;
