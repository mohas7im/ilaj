import { ViewTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CardTitle from "@/components/website/common/CardTitle";
import CardText from "@/components/website/common/CardText";
import type { WebsiteService } from "../../_lib/services";

// "Other services" card on the detail page. Its image morphs into the next
// detail page's hero, like the rows on the Services page.
export default function ServiceCard({ service, index = 0 }: { service: WebsiteService; index?: number }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      style={{ "--i": index } as React.CSSProperties}
      className="reveal group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-shadow duration-300 hover:shadow-lg"
    >
      <ViewTransition name={`service-image-${service.slug}`} share="morph" default="none">
        <div className="relative aspect-4/3 w-full overflow-hidden">
          <Image
            src={service.image}
            alt={service.imageAlt}
            fill
            className="object-cover transition-[scale] duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      </ViewTransition>

      <div className="flex flex-1 flex-col p-6">
        <CardTitle as="span" size="sm" tone="brand">
          {service.number}
        </CardTitle>
        <CardTitle className="mt-2">{service.title}</CardTitle>
        <CardText className="mt-2 line-clamp-2">{service.description}</CardText>

        <span className="mt-auto inline-flex items-center gap-3 pt-6 text-sm font-semibold text-brand">
          View Details
          <ArrowRight aria-hidden="true" className="size-5 transition-transform duration-200 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
