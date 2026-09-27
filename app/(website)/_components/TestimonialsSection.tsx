import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import Section, { Container } from "@/components/website/common/Section";
import SectionLabel from "@/components/website/common/SectionLabel";
import SectionTitle from "@/components/website/common/SectionTitle";
import CardTitle from "@/components/website/common/CardTitle";
import CardText from "@/components/website/common/CardText";
import MetaText from "@/components/website/common/MetaText";

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

export default function TestimonialsSection() {
  return (
    <Section contained={false} className="overflow-hidden bg-zinc-50">

      {/* Header */}
      <Container>
        <SectionLabel>CLIENT FEEDBACK</SectionLabel>

        <SectionTitle className="max-w-xl">
          Trusted by Smiles,
          <br />
          Loved by Patients
        </SectionTitle>
      </Container>

      {/* =====================================================
          CONTINUOUS ROWS — top drifts left, bottom drifts right.
          Hovering pauses both; "reduce motion" stops them.
      ====================================================== */}
      <div className="group mt-7 space-y-4">
        {ROWS.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={cn(
              "flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none",
              rowIndex === 1 && "[animation-direction:reverse]"
            )}
          >
            {/* The list twice: the second copy fills in as the first scrolls away */}
            {[0, 1].map((copy) =>
              row.map((testimonial, i) => (
                <TestimonialCard
                  key={`${copy}-${i}`}
                  testimonial={testimonial}
                  hidden={copy === 1}
                />
              ))
            )}
          </div>
        ))}
      </div>

    </Section>
  );
}

function TestimonialCard({ testimonial, hidden }: { testimonial: Testimonial; hidden: boolean }) {
  return (
    <article
      aria-hidden={hidden || undefined}
      className="mr-4 flex min-h-44 w-80 shrink-0 flex-col sm:w-96 rounded-2xl border border-zinc-200 bg-white px-5 py-4"
    >
      {/* Rating */}
      <div className="flex items-center gap-2">
        <Star className="size-4 fill-brand text-brand" aria-hidden="true" />
        <CardTitle as="span" size="sm">
          {testimonial.rating}
        </CardTitle>
      </div>

      {/* Review */}
      <CardText size="sm" className="mt-2">
        “{testimonial.review}”
      </CardText>

      {/* Patient */}
      <div className="mt-auto pt-3">
        <CardTitle size="sm">{testimonial.name}</CardTitle>
        <MetaText className="mt-0.5">{testimonial.treatment}</MetaText>
      </div>
    </article>
  );
}
