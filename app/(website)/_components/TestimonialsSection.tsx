import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import Section, { Container } from "@/components/website/common/Section";
import SectionLabel from "@/components/website/common/SectionLabel";
import SectionTitle from "@/components/website/common/SectionTitle";
import CardTitle from "@/components/website/common/CardTitle";
import CardText from "@/components/website/common/CardText";
import MetaText from "@/components/website/common/MetaText";
import { getWebsiteTestimonials, type WebsiteTestimonial } from "../_lib/testimonials";

// Splits the list into two marquee rows, the second one offset partway through
// so the same card never shows in both rows at the same time.
function toRows(testimonials: WebsiteTestimonial[]) {
  const offset = Math.min(4, Math.ceil(testimonials.length / 2));
  return [testimonials, [...testimonials.slice(offset), ...testimonials.slice(0, offset)]];
}

export default async function TestimonialsSection() {
  const testimonials = await getWebsiteTestimonials();
  if (testimonials.length === 0) return null;

  const ROWS = toRows(testimonials);

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
                  key={`${copy}-${testimonial.id}-${i}`}
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

function TestimonialCard({ testimonial, hidden }: { testimonial: WebsiteTestimonial; hidden: boolean }) {
  return (
    <article
      aria-hidden={hidden || undefined}
      className="mr-4 flex min-h-44 w-80 shrink-0 flex-col sm:w-96 rounded-2xl border border-zinc-200 bg-white px-5 py-4"
    >
      {/* Rating */}
      <div className="flex items-center gap-2">
        <Star className="size-4 fill-brand text-brand" aria-hidden="true" />
        <CardTitle as="span" size="sm">
          {testimonial.rating}/5
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
