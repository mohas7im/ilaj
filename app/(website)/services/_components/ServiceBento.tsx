import { ViewTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import CardTitle from "@/components/website/common/CardTitle";
import CardText from "@/components/website/common/CardText";
import type { WebsiteService } from "../../_lib/services";

/**
 * Services page grid: the first service is a large tile, the rest fill in around it.
 * Each tile is an image with the title on a dark gradient; on hover the image
 * zooms and the description slides up (always shown on touch screens).
 */
export default function ServiceBento({ services }: { services: WebsiteService[] }) {
  return (
    <div className="grid grid-flow-dense grid-cols-1 gap-4 sm:grid-cols-2 lg:auto-rows-[19rem] lg:grid-cols-4">
      {services.map((service, index) => (
        <ServiceTile key={service.slug} service={service} index={index} featured={index === 0} />
      ))}
    </div>
  );
}

function ServiceTile({
  service,
  index,
  featured,
}: {
  service: WebsiteService;
  index: number;
  featured: boolean;
}) {
  return (
    <Link
      href={`/services/${service.slug}`}
      style={{ "--i": index % 4 } as React.CSSProperties}
      className={cn(
        "reveal group relative isolate flex h-80 flex-col justify-end overflow-hidden rounded-2xl bg-neutral-900 p-6 lg:h-auto",
        featured && "h-112 sm:col-span-2 lg:row-span-2 lg:p-10"
      )}
    >
      {/* Image — flies into the detail page banner (view transition) */}
      <ViewTransition name={`service-image-${service.slug}`} share="morph" default="none">
        <div className="absolute inset-0 -z-10">
          <Image
            src={service.image}
            alt={service.imageAlt}
            fill
            className="object-cover transition-[scale] duration-700 ease-out group-hover:scale-105"
            sizes={featured ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"}
          />
        </div>
      </ViewTransition>
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/35 to-black/5" />

      {/* Arrow */}
      <span
        aria-hidden="true"
        className="absolute right-5 top-5 flex size-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition-[rotate,background-color] duration-300 group-hover:rotate-45 group-hover:bg-brand"
      >
        <ArrowUpRight className="size-5" strokeWidth={2.25} />
      </span>

      {/* Text */}
      <CardTitle as="span" size="sm" tone="light">
        {service.number}
      </CardTitle>
      <CardTitle as="h2" tone="light" className={cn("mt-2", featured && "lg:max-w-md")}>
        {service.title}
      </CardTitle>

      {/* Description: always open on the featured tile and touch screens,
          slides open on hover / keyboard focus elsewhere */}
      <div
        className={cn(
          "grid grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-out",
          !featured &&
            "[@media(hover:hover)]:grid-rows-[0fr] group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr]"
        )}
      >
        <div className="overflow-hidden">
          <CardText tone="light" className={cn("pt-2", featured ? "max-w-md" : "line-clamp-3")}>
            {service.description}
          </CardText>
        </div>
      </div>
    </Link>
  );
}
