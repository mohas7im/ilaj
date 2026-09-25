"use client";

import { useRef } from "react";

const TESTIMONIALS = [
  {
    name: "Priya Nair",
    treatment: "PATIENT OF BRACES & ALIGNERS",
    rating: "4.5/5",
    review:
      "Experience and compassion — our team delivers high-quality care in a patient-first environment.",
  },
  {
    name: "Ahmed Rahman",
    treatment: "ROOT CANAL TREATMENT",
    rating: "4.5/5",
    review:
      "The staff here genuinely care about your comfort. From the moment I walked in, I felt welcomed and safe. My smile has never looked better!",
  },
  {
    name: "Anjali Menon",
    treatment: "TEETH WHITENING",
    rating: "4.5/5",
    review:
      "After years of hiding my smile, this clinic gave me back my confidence. The results are amazing, and the care I received was beyond exceptional.",
  },
  {
    name: "Mohammed Adil",
    treatment: "TEETH WHITENING",
    rating: "4.5/5",
    review:
      "I am very happy with my teeth whitening results. The process was explained clearly, and the team made me feel comfortable throughout the treatment. My smile feels brighter and more confident.",
  },
  {
    name: "Diya Thomas",
    treatment: "BRACES & ALIGNERS",
    rating: "4.5/5",
    review:
      "I was nervous about the root canal, but it was easier than expected. The doctor explained each step and ensured my comfort.",
  },
  {
    name: "Rahul Nair",
    treatment: "DENTAL CONSULTATION",
    rating: "4.5/5",
    review:
      "Consultation to treatment was professional. The team answered my questions, making the procedure smooth. Highly recommended.",
  },
];

export default function TestimonialsSection() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!trackRef.current) return;

    const amount = 420;

    trackRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full overflow-hidden bg-white py-16 text-zinc-950 sm:py-20 lg:py-24">

      {/* =====================================================
          HEADER
      ====================================================== */}
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">

          {/* Heading */}
          <div>

            {/* Label */}
            <div className="mb-6">
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
                  font-mono
                "
              >
                CLIENT FEEDBACK
              </span>
            </div>

            <h2
              className="
                font-heading
                max-w-xl
                text-4xl
                font-normal
                leading-[1.1]
                tracking-tight
                sm:text-5xl
                lg:text-[46px]
              "
            >
              Trusted by Smiles,
              <br />
              Loved by Patients
            </h2>

          </div>

          {/* Navigation */}
          <div className="flex shrink-0 gap-3">

            <button
              type="button"
              onClick={() => scroll("left")}
              aria-label="Previous testimonials"
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
              onClick={() => scroll("right")}
              aria-label="Next testimonials"
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
      </div>

      {/* =====================================================
          TESTIMONIAL CAROUSEL
      ====================================================== */}

      <div
        ref={trackRef}
        className="
          mt-12
          flex
          gap-5
          overflow-x-auto
          px-5
          pb-2
          sm:mt-14
          sm:px-6
          lg:mt-16
          lg:px-8
          [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden
        "
      >

        {TESTIMONIALS.map((testimonial) => (
          <article
            key={testimonial.name}
            className="
              flex
              h-[318px]
              w-[calc(100vw-40px)]
              shrink-0
              flex-col
              rounded-2xl
              border
              border-zinc-200
              bg-white
              p-7
              sm:w-[490px]
              sm:p-8
              lg:w-[495px]
            "
          >

            {/* Rating */}
            <div className="flex items-center gap-3">

              <span
                className="
                  text-xl
                  leading-none
                  text-brand
                "
              >
                ★
              </span>

              <span
                className="
                  text-lg
                  font-medium
                  tracking-tight
                  text-zinc-950
                "
              >
                {testimonial.rating}
              </span>

            </div>

            {/* Review */}
            <p
              className="
                mt-5
                max-w-md
                text-base
                leading-relaxed
                text-zinc-900
                sm:text-lg
              "
            >
              “{testimonial.review}”
            </p>

            {/* Patient */}
            <div className="mt-auto">

              <h3
                className="
                  text-lg
                  font-semibold
                  tracking-tight
                  text-zinc-950
                "
              >
                {testimonial.name}
              </h3>

              <p
                className="
                  mt-1
                  text-xs
                  font-medium
                  uppercase
                  tracking-wider
                  text-zinc-800
                "
              >
                {testimonial.treatment}
              </p>

            </div>

          </article>
        ))}

      </div>
    </section>
  );
}
