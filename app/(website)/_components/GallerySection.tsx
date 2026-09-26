"use client";

import BeforeAfterCard from "./BeforeAfterCard";
import SectionLabel from "@/components/website/common/SectionLabel";
import SectionTitle from "@/components/website/common/SectionTitle";
import SectionDescription from "@/components/website/common/SectionDescription";
import ArrowButton from "@/components/website/ui/ArrowButton";

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
];

export default function GallerySection() {
  return (
    <section className="w-full bg-white py-16 text-zinc-950 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

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
            GALLERY
        ====================================================== */}
        <div
          className="
            mt-12
            grid
            grid-cols-1
            gap-4
            sm:mt-14
            md:grid-cols-2
            lg:grid-cols-3
          "
        >
          {GALLERY.map((item, index) => (
            <BeforeAfterCard
              key={index}
              before={item.before}
              after={item.after}
              alt={`Ilaj Dental Care transformation ${index + 1}`}
            />
          ))}
        </div>

        {/* =====================================================
            NAVIGATION
        ====================================================== */}
        <div className="mt-10 flex justify-center gap-2">

          <ArrowButton direction="prev" label="Previous gallery" />

          <ArrowButton direction="next" label="Next gallery" />

        </div>

      </div>
    </section>
  );
}
