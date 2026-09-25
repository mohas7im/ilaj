"use client";

import BeforeAfterCard from "./BeforeAfterCard";

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
            <div className="mb-7">
              <span
                className="
                  inline-flex
                  rounded-full
                  border border-zinc-200
                  px-4 py-2
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider
                  text-zinc-800
                "
              >
                ILAJ GALLERY HERE
              </span>
            </div>

            <h2
              className="
                font-heading
                max-w-2xl
                text-4xl
                font-normal
                leading-[1.1]
                tracking-tight
                sm:text-5xl
                lg:text-[48px]
              "
            >
              A Closer Look at
              <br />
              Your Smile Journey
            </h2>

          </div>

          {/* Description */}
          <div className="flex items-end lg:col-span-3">

            <p
              className="
                max-w-md
                text-base
                leading-relaxed
                text-zinc-900
                sm:text-lg
              "
            >
              Explore our patients’ transformations and take a look
              inside our clinic, designed to make every visit
              comfortable and confident.
            </p>

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
        <div className="mt-10 flex justify-center gap-3">

          <button
            type="button"
            aria-label="Previous gallery"
            className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-full
              border
              border-zinc-200
              text-2xl
              text-brand
              transition
              hover:bg-zinc-50
            "
          >
            ←
          </button>

          <button
            type="button"
            aria-label="Next gallery"
            className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-full
              border
              border-zinc-200
              text-2xl
              text-brand
              transition
              hover:bg-zinc-50
            "
          >
            →
          </button>

        </div>

      </div>
    </section>
  );
}
