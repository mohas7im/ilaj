import { ViewTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/website/common/Section";
import CardTitle from "@/components/website/common/CardTitle";
import CardText from "@/components/website/common/CardText";
import type { WebsiteService } from "../_lib/services";

/**
 * The service rows, shared by the home section and the Services page.
 * - boxed = false: full-width gray/white bands, content centered inside (home)
 * - boxed = true:  rows inside a bordered box within the page container (Services page)
 *
 * On desktop the rows stack: each pins below the navbar and the next slides
 * over it (CSS sticky). Phones scroll normally, since rows are taller there.
 */
export default function ServiceList({
  services,
  boxed = false,
}: {
  services: WebsiteService[];
  boxed?: boolean;
}) {
  const rows = services.map((service, index) => (
    <article
      key={service.slug}
      className={cn(
        "overflow-clip lg:sticky lg:top-20",
        index % 2 === 0 ? "bg-zinc-50" : "bg-white",
        index > 0 && "border-t border-zinc-100"
      )}
    >
      {boxed ? (
        <div className="px-6 py-10 sm:px-8 lg:px-12 lg:py-10">
          <ServiceRow service={service} />
        </div>
      ) : (
        <Container className="py-12 sm:py-14 lg:py-9">
          <ServiceRow service={service} />
        </Container>
      )}
    </article>
  ));

  // overflow-clip (not hidden) so the rows can still stick
  return boxed ? (
    <div className="overflow-clip border border-zinc-100">{rows}</div>
  ) : (
    <div className="border-t border-zinc-100">{rows}</div>
  );
}

function ServiceRow({ service }: { service: WebsiteService }) {
  const href = `/treatments/${service.slug}`;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-6">

      {/* Number */}
      <div className="reveal lg:col-span-2">
        <CardTitle as="span" tone="brand">
          {service.number}
        </CardTitle>
      </div>

      {/* Content */}
      <div className="reveal flex flex-col lg:col-span-6">
        <CardTitle>
          <Link href={href} className="transition-colors hover:text-brand">
            {service.title}
          </Link>
        </CardTitle>

        <CardText className="mt-3 max-w-sm">
          {service.description}
        </CardText>

        <Link
          href={href}
          className="group mt-auto inline-flex w-fit items-center gap-4 pt-8 text-sm font-semibold text-brand"
        >
          <span>View Details</span>
          <ArrowRight
            aria-hidden="true"
            className="size-5 transition-transform duration-200 group-hover:translate-x-1"
          />
        </Link>
      </div>

      {/* Images — the first one flies into the detail page hero (view transition) */}
      <Link href={href} tabIndex={-1} aria-hidden="true" className="grid grid-cols-2 gap-4 lg:col-span-4">
        <ViewTransition name={`service-image-${service.slug}`} share="morph" default="none">
          <ServiceImage src={service.image} alt={service.imageAlt} />
        </ViewTransition>
        <ServiceImage src={service.secondaryImage} alt={service.secondaryImageAlt} />
      </Link>

    </div>
  );
}

// Empty gray square until the image is uploaded in admin, so rows stay even.
function ServiceImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="reveal-image relative aspect-square w-full overflow-hidden rounded-xl bg-zinc-100">
      {src && (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-[scale] duration-500 hover:scale-105"
          sizes="(max-width: 1024px) 45vw, 220px"
        />
      )}
    </div>
  );
}
