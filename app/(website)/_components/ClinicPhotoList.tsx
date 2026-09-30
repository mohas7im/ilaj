import Image from "next/image";
import { cn } from "@/lib/utils";
import CardTitle from "@/components/website/common/CardTitle";
import CardText from "@/components/website/common/CardText";
import { pad } from "../_lib/clinic-tour";
import type { ClinicPhoto } from "@/domain/clinic-photo/clinic-photo.types";

/**
 * Plain list of clinic photos with number, name and description. Shown where
 * the scroll tours don't fit: phones (camera tour) and prefers-reduced-motion.
 * Each photo opens from a centre slit as it scrolls in (.reveal-door).
 */
export default function ClinicPhotoList({ photos, className }: { photos: ClinicPhoto[]; className?: string }) {
  return (
    <ol className={cn("grid gap-x-8 gap-y-12 md:grid-cols-2", className)}>
      {photos.map((photo, index) => (
        <li key={photo.id}>
          <figure>
            <div className="reveal-door relative aspect-4/5 w-full overflow-hidden rounded-2xl bg-zinc-100 sm:aspect-3/2">
              <Image
                src={photo.image}
                alt={photo.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <figcaption className="mt-4">
              <div className="flex items-baseline gap-3">
                <CardTitle as="span" size="sm" tone="brand" className="tabular-nums">{pad(index + 1)}</CardTitle>
                <CardTitle as="h3">{photo.heading}</CardTitle>
              </div>
              {photo.description && <CardText className="mt-2 max-w-md">{photo.description}</CardText>}
            </figcaption>
          </figure>
        </li>
      ))}
    </ol>
  );
}
