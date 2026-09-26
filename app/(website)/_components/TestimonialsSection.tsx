"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import SectionLabel from "@/components/website/common/SectionLabel";
import SectionTitle from "@/components/website/common/SectionTitle";
import CardTitle from "@/components/website/common/CardTitle";
import CardText from "@/components/website/common/CardText";
import MetaText from "@/components/website/common/MetaText";
import ArrowButton from "@/components/website/ui/ArrowButton";

type Testimonial = {
  name: string;
  treatment: string;
  rating: string;
  review: string;
};

const TESTIMONIALS: Testimonial[] = [
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
    name: "Anjali Menon",
    treatment: "TEETH WHITENING",
    rating: "4.5/5",
    review:
      "I am very happy with my teeth whitening results. The process was explained clearly, and the team made me feel comfortable throughout the treatment. My smile feels brighter and more confident now.",
  },
  {
    name: "Mohammed Adil",
    treatment: "ROOT CANAL TREATMENT",
    rating: "4.5/5",
    review:
      "I was nervous about the root canal, but it was easier than expected. The doctor explained each step and ensured my comfort.",
  },
  {
    name: "Diya Thomas",
    treatment: "BRACES & ALIGNERS",
    rating: "4.5/5",
    review:
      "My experience with Ilaj has been great. The team has supported my aligner journey, and I see a difference in my smile.",
  },
  {
    name: "Rahul Nair",
    treatment: "DENTAL IMPLANTS",
    rating: "4.5/5",
    review:
      "Consultation to treatment was professional. The team answered my questions, making the procedure smooth. Highly recommended.",
  },
];

// Row 2 starts four cards later so the two rows never show the same card side by side.
const ROWS = [TESTIMONIALS, [...TESTIMONIALS.slice(4), ...TESTIMONIALS.slice(0, 4)]];

// The endless loop: each row renders COPIES copies of the list and starts on the
// middle one. After a slide ends, the position is snapped back by one full list
// length (looks identical), so the rows can slide forever in both directions.
const COPIES = 5;
const MIDDLE = Math.floor(COPIES / 2);
const LENGTH = TESTIMONIALS.length;

export default function TestimonialsSection() {
  const [step, setStep] = useState(0);
  const [animate, setAnimate] = useState(true);

  const slide = (direction: 1 | -1) => {
    setAnimate(true);
    setStep((current) => current + direction);
  };

  const handleSlideEnd = (event: React.TransitionEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    if (Math.abs(step) >= LENGTH) {
      setAnimate(false);
      setStep((current) => current % LENGTH);
    }
  };

  // Turn the animation back on two frames after an invisible snap, so the
  // browser has painted the snapped position before transitions return.
  useEffect(() => {
    if (animate) return;
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setAnimate(true));
    });
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, [animate]);

  return (
    <section className="w-full overflow-hidden bg-zinc-50 py-16 text-zinc-950 sm:py-20 lg:py-24">
      <div
        className="
          mx-auto
          max-w-7xl
          px-5
          sm:px-6
          lg:px-8
          [--card-w:100%]
          [--pitch:calc(var(--card-w)+1rem)]
          sm:[--card-w:calc((100%-1rem)/2)]
          lg:[--card-w:calc((100%-2rem)/3)]
        "
      >

        {/* =====================================================
            HEADER
        ====================================================== */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">

          <div>
            <SectionLabel>CLIENT FEEDBACK</SectionLabel>

            <SectionTitle className="max-w-xl">
              Trusted by Smiles,
              <br />
              Loved by Patients
            </SectionTitle>
          </div>

          {/* Navigation */}
          <div className="flex shrink-0 gap-2">
            <ArrowButton direction="prev" label="Previous testimonials" onClick={() => slide(-1)} />
            <ArrowButton direction="next" label="Next testimonials" onClick={() => slide(1)} />
          </div>

        </div>

        {/* =====================================================
            TESTIMONIAL ROWS — overflow past the container edges
        ====================================================== */}
        <div className="mt-7 space-y-4">
          {ROWS.map((row, rowIndex) => (
            <div
              key={rowIndex}
              onTransitionEnd={rowIndex === 0 ? handleSlideEnd : undefined}
              className={cn(
                "flex gap-4 will-change-transform motion-reduce:transition-none",
                animate && "transition-transform duration-500 ease-out",
                rowIndex === 1 && "[--row-shift:calc(var(--pitch)/2)]"
              )}
              style={{
                transform: `translateX(calc(var(--row-shift, 0px) - ${MIDDLE * LENGTH + step} * var(--pitch)))`,
              }}
            >
              {Array.from({ length: COPIES }, (_, copy) =>
                row.map((testimonial, i) => (
                  <TestimonialCard
                    key={`${copy}-${i}`}
                    testimonial={testimonial}
                    hidden={copy !== MIDDLE}
                  />
                ))
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

function TestimonialCard({ testimonial, hidden }: { testimonial: Testimonial; hidden: boolean }) {
  return (
    <article
      aria-hidden={hidden || undefined}
      className="flex h-64 w-(--card-w) shrink-0 flex-col rounded-3xl border border-zinc-200 bg-white px-8 pb-7 pt-7"
    >
      {/* Rating */}
      <div className="flex items-center gap-2">
        <Star className="size-4 fill-brand text-brand" aria-hidden="true" />
        <CardTitle as="span" size="sm">
          {testimonial.rating}
        </CardTitle>
      </div>

      {/* Review */}
      <CardText className="mt-4">
        “{testimonial.review}”
      </CardText>

      {/* Patient */}
      <div className="mt-auto">
        <CardTitle size="sm">{testimonial.name}</CardTitle>
        <MetaText className="mt-0.5">{testimonial.treatment}</MetaText>
      </div>
    </article>
  );
}
