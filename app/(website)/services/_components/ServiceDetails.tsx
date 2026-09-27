import { ViewTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { Container } from "@/components/website/common/Section";
import SectionLabel from "@/components/website/common/SectionLabel";
import SectionTitle, { Highlight } from "@/components/website/common/SectionTitle";
import SectionDescription from "@/components/website/common/SectionDescription";
import CardTitle from "@/components/website/common/CardTitle";
import CardText from "@/components/website/common/CardText";
import Button from "@/components/website/ui/Button";
import type { WebsiteService } from "../../_lib/services";
import { PLACEHOLDER_BENEFITS, PLACEHOLDER_FAQS, PLACEHOLDER_OVERVIEW } from "../_data/placeholder";
import ServiceCard from "./ServiceCard";

// Service detail: header, hero image (morph target), overview + benefits,
// Service detail: full-width image banner with the title on it (morph target),
// then overview + benefits, FAQ and other services on white.
export default function ServiceDetails({
  service,
  others,
}: {
  service: WebsiteService;
  others: WebsiteService[];
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
            href="/services"
            className="group inline-flex w-fit items-center gap-2 text-sm font-semibold text-white/80 transition-colors hover:text-white"
          >
            <ArrowLeft aria-hidden="true" className="size-4 transition-transform duration-200 group-hover:-translate-x-1" />
            All Services
          </Link>

          <SectionLabel tone="light" className="mt-8">
            OUR DENTAL SERVICES · {service.number}
          </SectionLabel>

          <div className="max-w-3xl border-t border-white/25 pt-6">
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
            OVERVIEW + BENEFITS / SECOND IMAGE
        ====================================================== */}
        <Container className="mt-16 grid grid-cols-1 gap-12 lg:mt-24 lg:grid-cols-12 lg:gap-14">

          <div className="lg:col-span-7">
            <SectionLabel>ABOUT THIS TREATMENT</SectionLabel>
            <SectionTitle>
              Care That Puts <Highlight>Your Comfort First</Highlight>
            </SectionTitle>
            {/* Admin "Detailed Description"; blank lines split paragraphs */}
            {(service.details || PLACEHOLDER_OVERVIEW)
              .split(/\n\s*\n/)
              .map((paragraph) => paragraph.trim())
              .filter(Boolean)
              .map((paragraph, index) => (
                <SectionDescription key={index} className="mt-5 whitespace-pre-line">
                  {paragraph}
                </SectionDescription>
              ))}

            {/* Benefits — numbered like the Why Choose Us list */}
            <div className="mt-12 space-y-6">
              {PLACEHOLDER_BENEFITS.map((benefit, index) => (
                <div key={benefit} className="scroll-highlight flex items-baseline gap-4">
                  <CardTitle as="span" size="sm" tone="brand" className="relative top-0.5 w-7 shrink-0 text-right">
                    {String(index + 1).padStart(2, "0")}
                  </CardTitle>
                  <CardTitle>{benefit}</CardTitle>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="reveal-image relative aspect-4/5 w-full overflow-hidden rounded-2xl">
              <Image
                src={service.secondaryImage}
                alt={service.secondaryImageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 480px"
              />
            </div>
          </div>

        </Container>

        {/* =====================================================
            FAQ — native <details>, one open at a time (same name), no JS
        ====================================================== */}
        <Container className="mt-16 grid grid-cols-1 gap-10 lg:mt-24 lg:grid-cols-12 lg:gap-14">

          <div className="lg:col-span-5">
            <SectionLabel>FAQ</SectionLabel>
            <SectionTitle>
              Questions About <Highlight>{service.title}</Highlight>
            </SectionTitle>
            <SectionDescription className="mt-5 max-w-md">
              Can&apos;t find your answer? Our team is happy to help.
            </SectionDescription>
          </div>

          <div className="border-b border-zinc-200 lg:col-span-7">
            {PLACEHOLDER_FAQS.map((faq, index) => (
              <details
                key={faq.question}
                name="service-faq"
                open={index === 0}
                style={{ "--i": index } as React.CSSProperties}
                className="faq-item reveal group border-t border-zinc-200"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
                  <CardTitle as="span" size="sm" className="transition-colors group-hover:text-brand">
                    {faq.question.replace("{service}", service.title)}
                  </CardTitle>
                  <span
                    aria-hidden="true"
                    className="flex size-9 shrink-0 items-center justify-center rounded-full border border-zinc-200 text-zinc-950 transition-[rotate,background-color,color,border-color] duration-300 group-open:rotate-45 group-open:border-brand group-open:bg-brand group-open:text-white"
                  >
                    <Plus className="size-4" strokeWidth={2.5} />
                  </span>
                </summary>

                <CardText className="max-w-xl pb-6 pr-14">{faq.answer}</CardText>
              </details>
            ))}
          </div>

        </Container>

        {/* =====================================================
            OTHER SERVICES
        ====================================================== */}
        {others.length > 0 && (
          <Container className="mt-16 lg:mt-24">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <SectionLabel>MORE TREATMENTS</SectionLabel>
                <SectionTitle>
                  Explore <Highlight>Other Services</Highlight>
                </SectionTitle>
              </div>

              <Link href="/services" className="shrink-0">
                <Button variant="secondary">All Services</Button>
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
