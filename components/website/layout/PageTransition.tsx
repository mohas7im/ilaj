"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";

// Keyed by path so each navigation exits the old page and enters the new one.
// Replicates the original ViewTransition page-out / page-in CSS animations:
//   exit  → opacity 0 over 150 ms (ease-in)
//   enter → opacity 0 + translateY 12px → resting, 350 ms spring-like ease,
//           delayed 100 ms (so the exit finishes before the enter begins).
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const shouldReduce = useReducedMotion();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: shouldReduce ? 0 : 12 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: {
            duration: shouldReduce ? 0 : 0.35,
            ease: [0.22, 1, 0.36, 1],
            delay: shouldReduce ? 0 : 0.1,
          },
        }}
        exit={{
          opacity: 0,
          y: 0,
          transition: {
            duration: shouldReduce ? 0 : 0.15,
            ease: "easeIn",
          },
        }}
        // Sits above the footer with a solid background; the footer tucks
        // underneath and its content rises out from behind it (see Footer.tsx).
        className="relative z-10 flex-1 bg-white"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
