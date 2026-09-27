import { ViewTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import CardTitle from "@/components/website/common/CardTitle";
import CardText from "@/components/website/common/CardText";
import type { WebsiteService } from "../../_lib/services";

// One "Other services" panel on the detail page. Place inside a `.panels` row:
// on desktop it widens on hover (styles/website/theme.css), and its image
// morphs into the next detail page's banner.
export default function ServiceCard({ service, index = 0 }: { service: WebsiteService; index?: number }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      style={{ "--i": index } as React.CSSProperties}
      className="panel reveal group relative isolate flex h-80 flex-col justify-end overflow-hidden rounded-2xl bg-neutral-900 p-6 lg:h-auto lg:p-7"
    >
      <ViewTransition name={`service-image-${service.slug}`} share="morph" default="none">
        <div className="absolute inset-0 -z-10">
          <Image
            src={service.image}
            alt={service.imageAlt}
            fill
            className="object-cover transition-[scale] duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </ViewTransition>
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/30 to-black/5" />

      <span
        aria-hidden="true"
        className="absolute right-5 top-5 flex size-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition-[rotate,background-color] duration-300 group-hover:rotate-45 group-hover:bg-brand"
      >
        <ArrowUpRight className="size-5" strokeWidth={2.25} />
      </span>

      <CardTitle as="span" size="sm" tone="light">
        {service.number}
      </CardTitle>
      <CardTitle tone="light" className="mt-2">
        {service.title}
      </CardTitle>

      {/* Shown when the panel is wide (always on phones) */}
      <div className="panel-extra">
        <CardText tone="light" className="mt-2 line-clamp-3">
          {service.description}
        </CardText>
        <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white">
          View Details
          <ArrowUpRight aria-hidden="true" className="size-4" />
        </span>
      </div>
    </Link>
  );
}
