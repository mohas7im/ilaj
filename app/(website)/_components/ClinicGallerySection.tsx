"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Section from "@/components/website/common/Section";
import SectionLabel from "@/components/website/common/SectionLabel";
import SectionTitle, { Highlight } from "@/components/website/common/SectionTitle";
import SectionDescription from "@/components/website/common/SectionDescription";
import CardTitle from "@/components/website/common/CardTitle";
import type { ClinicPhoto } from "@/domain/clinic-photo/clinic-photo.types";

/** Photos shown by default (the About page); the Gallery page passes Infinity */
const DEFAULT_LIMIT = 6;

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Clinic photos (About and Gallery pages): sticky text + scrolling photos. On desktop the
 * heading and a numbered list of spaces stay pinned on the left while large
 * photos scroll normally on the right; the space whose photo is in the middle
 * of the screen is highlighted, and clicking a name scrolls to its photo.
 * Phones get the heading, then the photos with their names underneath.
 */
export default function ClinicGallerySection({
  photos,
  limit = DEFAULT_LIMIT,
  titleAs = "h2",
}: {
  photos: ClinicPhoto[];
  limit?: number;
  /** "h1" when this section is the page's main heading (Gallery page) */
  titleAs?: "h1" | "h2";
}) {
  const items = photos.slice(0, limit);
  const [active, setActive] = useState(0);
  const photoRefs = useRef<(HTMLElement | null)[]>([]);

  // Highlight the photo crossing the middle band of the screen
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    photoRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Smart sticky: if the left column is taller than the screen (long list on
  // the Gallery page), stick it by its bottom instead, so it scrolls up with
  // the page until the last item is visible and every name stays reachable.
  const leftRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const left = leftRef.current;
    if (!left) return;

    const NAVBAR_GAP = 112; // lg:top-28, just below the navbar
    const BOTTOM_GAP = 32;
    const place = () => {
      const top = Math.min(NAVBAR_GAP, window.innerHeight - left.offsetHeight - BOTTOM_GAP);
      left.style.top = `${top}px`;
    };

    place();
    const observer = new ResizeObserver(place);
    observer.observe(left);
    window.addEventListener("resize", place);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", place);
    };
  }, []);

  return (
    <Section>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">

        {/* Left — sticky on desktop (top set by the smart sticky effect above) */}
        <div ref={leftRef} className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
          <SectionLabel>OUR CLINIC</SectionLabel>
          <SectionTitle as={titleAs}>
            A Space Designed
            <br />
            <Highlight>Around Your Comfort</Highlight>
          </SectionTitle>
          <SectionDescription className="mt-5 max-w-md">
            Bright, calm and fully equipped, every corner of our clinic is
            built to make your visit feel easy.
          </SectionDescription>

          {/* Spaces list (desktop) */}
          <ol className="mt-12 hidden border-b border-zinc-200 lg:block">
            {items.map((photo, index) => (
              <li key={photo.id} className="border-t border-zinc-200">
                <a
                  href={`#clinic-photo-${index}`}
                  aria-current={active === index ? "true" : undefined}
                  className={cn(
                    "group flex items-baseline gap-4 py-4 transition-opacity duration-300",
                    active === index ? "opacity-100" : "opacity-35 hover:opacity-70"
                  )}
                >
                  <CardTitle as="span" size="sm" tone="brand" className="w-7 shrink-0">
                    {pad(index + 1)}
                  </CardTitle>
                  <CardTitle as="span">{photo.heading}</CardTitle>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "ml-auto h-0.5 origin-right self-center bg-brand transition-[width] duration-300",
                      active === index ? "w-10" : "w-0"
                    )}
                  />
                </a>
              </li>
            ))}
          </ol>
        </div>

        {/* Right — photos scroll normally */}
        <div className="space-y-6 lg:col-span-7">
          {items.map((photo, index) => (
            <figure
              key={photo.id}
              id={`clinic-photo-${index}`}
              data-index={index}
              ref={(el) => {
                photoRefs.current[index] = el;
              }}
              className="scroll-mt-28"
            >
              <div className="reveal-image relative aspect-3/2 w-full overflow-hidden rounded-2xl bg-zinc-100">
                <Image
                  src={photo.image}
                  alt={photo.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              </div>

              {/* Name under the photo (phones; desktop shows it in the list) */}
              <figcaption className="mt-3 flex items-baseline gap-3 lg:hidden">
                <CardTitle as="span" size="sm" tone="brand">{pad(index + 1)}</CardTitle>
                <CardTitle as="h3" size="sm">{photo.heading}</CardTitle>
              </figcaption>
            </figure>
          ))}
        </div>

      </div>
    </Section>
  );
}
