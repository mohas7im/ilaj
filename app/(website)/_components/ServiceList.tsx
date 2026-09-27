import { ViewTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/website/common/Section";
import CardTitle from "@/components/website/common/CardTitle";
import CardText from "@/components/website/common/CardText";
import type { WebsiteService } from "../_lib/services";

/** Home page service rows: full-width gray/white bands, content centered inside. */
export default function ServiceList({ services }: { services: WebsiteService[] }) {
  return (
    <div className="border-t border-zinc-100">
      {services.map((service, index) => (
        <article
          key={service.slug}
          className={cn(
            index % 2 === 0 ? "bg-zinc-50" : "bg-white",
            index > 0 && "border-t border-zinc-100"
          )}
        >
          <Container className="py-12 sm:py-14 lg:py-9">
            <ServiceRow service={service} />
          </Container>
        </article>
      ))}
    </div>
  );
}

function ServiceRow({ service }: { service: WebsiteService }) {
  const href = `/services/${service.slug}`;

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

function ServiceImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="reveal-image relative aspect-square w-full overflow-hidden rounded-xl">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-[scale] duration-500 hover:scale-105"
        sizes="(max-width: 1024px) 45vw, 220px"
      />
    </div>
  );
}
