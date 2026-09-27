"use client";

import BeforeAfterCard from "./BeforeAfterCard";
import Section from "@/components/website/common/Section";
import SectionLabel from "@/components/website/common/SectionLabel";
import SectionTitle from "@/components/website/common/SectionTitle";
import SectionDescription from "@/components/website/common/SectionDescription";
import ArrowButton from "@/components/website/ui/ArrowButton";
import { useSnapCarousel } from "@/components/website/common/useSnapCarousel";

const GALLERY = [
  {
    before: "/images/gallery/smile-before-1.jpg",
    after: "/images/gallery/smile-after-1.jpg",
  },
  {
    before: "/images/gallery/smile-before-2.jpg",
    after: "/images/gallery/smile-after-2.jpg",
  },
  {
    before: "/images/gallery/smile-before-3.jpg",
    after: "/images/gallery/smile-after-3.jpg",
  },
  // PLACEHOLDER cases (reusing existing photos) so the arrows have more to show
  {
    before: "/images/gallery/smile-before-1.jpg",
    after: "/images/gallery/smile-after-1.jpg",
  },
  {
    before: "/images/gallery/smile-before-2.jpg",
    after: "/images/gallery/smile-after-2.jpg",
  },
  {
    before: "/images/gallery/smile-before-3.jpg",
    after: "/images/gallery/smile-after-3.jpg",
  },
];

export default function GallerySection() {
  const { trackRef, canPrev, canNext, scrollByCard } = useSnapCarousel();

  return (
    <Section>

        {/* =====================================================
            HEADER
        ====================================================== */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-10 lg:gap-14">

          {/* Heading */}
          <div className="lg:col-span-7">

            {/* Label */}
            <SectionLabel>ILAJ GALLERY HERE</SectionLabel>

            <SectionTitle className="max-w-2xl">
              A Closer Look at
              <br />
              Your Smile Journey
            </SectionTitle>

          </div>

          {/* Description */}
          <div className="flex items-end lg:col-span-3">

            <SectionDescription className="max-w-md">
              Explore our patients’ transformations and take a look
              inside our clinic, designed to make every visit
              comfortable and confident.
            </SectionDescription>

          </div>

        </div>

        {/* =====================================================
            GALLERY — snapping strip: 3 cards on desktop, 2 on tablet, 1 on phones
        ====================================================== */}
        <div
          ref={trackRef}
          className="
            mt-12
            flex
            snap-x
            snap-mandatory
            gap-4
            overflow-x-auto
            overscroll-x-contain
            sm:mt-14
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
          "
        >
          {GALLERY.map((item, index) => (
            <div
              key={index}
              className="shrink-0 basis-[85%] snap-start md:basis-[calc((100%-1rem)/2)] lg:basis-[calc((100%-2rem)/3)]"
            >
              <BeforeAfterCard
                before={item.before}
                after={item.after}
                alt={`Ilaj Dental Care transformation ${index + 1}`}
              />
            </div>
          ))}
        </div>

        {/* =====================================================
            NAVIGATION
        ====================================================== */}
        <div className="mt-10 flex justify-center gap-2">

          <ArrowButton direction="prev" label="Previous gallery" disabled={!canPrev} onClick={() => scrollByCard(-1)} />

          <ArrowButton direction="next" label="Next gallery" disabled={!canNext} onClick={() => scrollByCard(1)} />

        </div>

      </Section>
  );
}
