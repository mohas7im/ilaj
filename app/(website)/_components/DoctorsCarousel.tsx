"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import CardTitle from "@/components/website/common/CardTitle";
import MetaText from "@/components/website/common/MetaText";
import ArrowButton from "@/components/website/ui/ArrowButton";
import { stepTrack, useSnapCarousel } from "@/components/website/common/useSnapCarousel";

export type Doctor = { name: string; qualification: string; image: string };

const AUTOPLAY_MS = 3500;

/**
 * Doctor cards in a snapping strip: swipe/trackpad scroll natively, or use the
 * arrows. It also advances one card every AUTOPLAY_MS and loops back to the
 * start; autoplay pauses on hover/focus, after the visitor scrolls or clicks,
 * while off screen, and never runs for prefers-reduced-motion.
 */
export default function DoctorsCarousel({
  heading,
  doctors,
}: {
  heading: React.ReactNode;
  doctors: Doctor[];
}) {
  const { trackRef, canPrev, canNext, scrollByCard: step } = useSnapCarousel();

  // Autoplay. Hover/focus pause it; any visitor interaction delays the next
  // step by a full interval so it never fights a swipe or arrow click.
  const hovered = useRef(false);
  const lastInteraction = useRef(0);
  const markInteraction = () => {
    lastInteraction.current = Date.now();
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let visible = false;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    }, { threshold: 0.3 });
    observer.observe(track);

    const timer = window.setInterval(() => {
      if (!visible || hovered.current || document.hidden) return;
      if (Date.now() - lastInteraction.current < AUTOPLAY_MS) return;

      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
      if (atEnd) track.scrollTo({ left: 0, behavior: "smooth" });
      else stepTrack(track, 1);
    }, AUTOPLAY_MS);

    return () => {
      window.clearInterval(timer);
      observer.disconnect();
    };
  }, [trackRef]);

  const scrollByCard = (direction: 1 | -1) => {
    markInteraction();
    step(direction);
  };

  return (
    <>
      {/* Heading + Arrows */}
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        {heading}

        <div className="flex shrink-0 gap-2">
          <ArrowButton direction="prev" label="Previous doctors" disabled={!canPrev} onClick={() => scrollByCard(-1)} />
          <ArrowButton direction="next" label="Next doctors" disabled={!canNext} onClick={() => scrollByCard(1)} />
        </div>
      </div>

      {/* Cards */}
      <div
        ref={trackRef}
        onMouseEnter={() => (hovered.current = true)}
        onMouseLeave={() => (hovered.current = false)}
        onFocus={() => (hovered.current = true)}
        onBlur={() => (hovered.current = false)}
        onPointerDown={markInteraction}
        onWheel={markInteraction}
        className="reveal mt-16 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {doctors.map((doctor) => (
          <article
            key={doctor.name}
            className={cn(
              "group flex shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white",
              "basis-[85%] sm:basis-[calc((100%-1rem)/2.2)] lg:basis-[calc((100%-3rem)/4)]"
            )}
          >
            {/* Card Information — qualification always reserves 2 lines so cards stay even */}
            <div className="p-6">
              <CardTitle>{doctor.name}</CardTitle>
              <MetaText className="mt-2 min-h-8">{doctor.qualification}</MetaText>
            </div>

            {/* Doctor Image */}
            <div className="relative mt-auto aspect-9/10 w-full overflow-hidden">
              <Image
                src={doctor.image}
                alt={doctor.name}
                fill
                className="object-cover transition-[scale] duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 25vw"
              />
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
