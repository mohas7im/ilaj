import { ViewTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/website/common/Section";
import SectionLabel from "@/components/website/common/SectionLabel";
import SectionTitle, { Highlight } from "@/components/website/common/SectionTitle";
import SectionDescription from "@/components/website/common/SectionDescription";
import Faq, { type FaqItem } from "@/components/website/common/Faq";
import Button from "@/components/website/ui/Button";
import type { WebsiteService } from "../../_lib/services";
import { toRichTextHtml } from "@/lib/rich-text";
import { PLACEHOLDER_CONTENT } from "../_data/placeholder";
import ServiceCard from "./ServiceCard";

// Service detail: full-width image banner with the title on it (morph target),
// then admin rich-text content, the treatment's FAQs and other services on white.
export default function ServiceDetails({
  service,
  others,
  faqs,
}: {
  service: WebsiteService;
  others: WebsiteService[];
  /** Published FAQs for this treatment; the section is hidden when empty */
  faqs: FaqItem[];
}) {
  return (
    <>
      {/* =====================================================
          HERO BANNER — the Services page image flies in here
      ====================================================== */}
      <section className="relative w-full overflow-hidden bg-neutral-950">
        <ViewTransition name={`service-image-${service.slug}`} share="morph" default="none">
          <div className="absolute inset-0">
            <Image
              src={service.image}
              alt={service.imageAlt}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          </div>
        </ViewTransition>
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />

        <Container className="relative flex min-h-108 flex-col justify-center py-14">
          <Link
            href="/treatments"
            className="group inline-flex w-fit items-center gap-2 text-sm font-semibold text-white/80 transition-colors hover:text-white"
          >
            <ArrowLeft aria-hidden="true" className="size-4 transition-transform duration-200 group-hover:-translate-x-1" />
            All Treatments
          </Link>

          <div className="mt-8 max-w-3xl border-t border-white/25 pt-6">
            <SectionTitle as="h1" tone="light">{service.title}</SectionTitle>
            <SectionDescription tone="light" className="mt-3 max-w-xl">
              {service.description}
            </SectionDescription>
          </div>

          <Link href="/contact#book-appointment" className="mt-8 w-fit">
            <Button variant="primary">Book This Treatment</Button>
          </Link>
        </Container>
      </section>

      <div className="pb-16 lg:pb-24">

        {/* =====================================================
            CONTENT — admin "Detailed Description" (rich text), styled by .rich-text
        ====================================================== */}
        <Container className="mt-16 lg:mt-24">
          <article
            className="rich-text mx-auto max-w-3xl"
            dangerouslySetInnerHTML={{ __html: toHtml(service.details, service.title) }}
          />
        </Container>

        {/* =====================================================
            FAQ — native <details>, one open at a time (same name), no JS
        ====================================================== */}
        {faqs.length > 0 && (
          <Container className="mt-16 lg:mt-24">
            <Faq
              name="service-faq"
              title={<>Questions About <Highlight>{service.title}</Highlight></>}
              description={<>Can&apos;t find your answer? Our team is happy to help.</>}
              faqs={faqs}
            />
          </Container>
        )}

        {/* =====================================================
            OTHER TREATMENTS
        ====================================================== */}
        {others.length > 0 && (
          <Container className="mt-16 lg:mt-24">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <SectionLabel>MORE TREATMENTS</SectionLabel>
                <SectionTitle>
                  Explore <Highlight>Other Treatments</Highlight>
                </SectionTitle>
              </div>

              <Link href="/treatments" className="shrink-0">
                <Button variant="secondary">All Treatments</Button>
              </Link>
            </div>

            {/* Expanding panels: first starts wide, hovered one widens */}
            <div className="panels mt-10 grid grid-cols-1 gap-4">
              {others.slice(0, 3).map((other, index) => (
                <ServiceCard key={other.slug} service={other} index={index} />
              ))}
            </div>
          </Container>
        )}

      </div>
    </>
  );
}

// Admin content is rich-text HTML, sanitized when saved (server/lib/sanitize.ts);
// older entries may still be plain text. Empty → placeholder until filled in.
function toHtml(details: string, serviceName: string): string {
  if (!details.trim()) return PLACEHOLDER_CONTENT.replaceAll("{service}", serviceName);
  return toRichTextHtml(details);
}
