"use client";

import BeforeAfterCard from "./BeforeAfterCard";
import ArrowButton from "@/components/website/ui/ArrowButton";
import { useSnapCarousel } from "@/components/website/common/useSnapCarousel";
import type { PatientCase } from "@/domain/patient-case/patient-case.types";

// Snapping strip of before/after cards: 3 on desktop, 2 on tablet, 1 on phones.
export default function GalleryCarousel({ cases }: { cases: PatientCase[] }) {
  const { trackRef, canPrev, canNext, scrollByCard } = useSnapCarousel();

  return (
    <>
      <div
        ref={trackRef}
        className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain sm:mt-14 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {cases.map((item) => (
          <div
            key={item.id}
            className="shrink-0 basis-[85%] snap-start md:basis-[calc((100%-1rem)/2)] lg:basis-[calc((100%-2rem)/3)]"
          >
            <BeforeAfterCard before={item.beforeImage} after={item.afterImage} alt={item.heading} />
          </div>
        ))}
      </div>

      <div className="mt-10 flex justify-center gap-2">
        <ArrowButton direction="prev" label="Previous gallery" disabled={!canPrev} onClick={() => scrollByCard(-1)} />
        <ArrowButton direction="next" label="Next gallery" disabled={!canNext} onClick={() => scrollByCard(1)} />
      </div>
    </>
  );
}
