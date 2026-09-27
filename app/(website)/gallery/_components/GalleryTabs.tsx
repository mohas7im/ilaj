"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import CardTitle from "@/components/website/common/CardTitle";
import CardText from "@/components/website/common/CardText";
import type { ClinicPhoto } from "@/domain/clinic-photo/clinic-photo.types";
import type { PatientCase } from "@/domain/patient-case/patient-case.types";
import BeforeAfterCard from "../../_components/BeforeAfterCard";

const TABS = [
  { id: "clinic", label: "Clinic’s Gallery" },
  { id: "cases", label: "Before & After Transformation" },
] as const;

type TabId = (typeof TABS)[number]["id"];

/** Pill toggle between clinic photos and before/after cases. */
export default function GalleryTabs({
  photos,
  cases,
}: {
  photos: ClinicPhoto[];
  cases: PatientCase[];
}) {
  const [tab, setTab] = useState<TabId>("clinic");

  return (
    <>
      {/* Tabs */}
      <div className="flex justify-center">
        <div role="tablist" aria-label="Gallery" className="inline-flex flex-wrap justify-center gap-1 rounded-full bg-zinc-100 p-1.5">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`tab-${item.id}`}
              aria-selected={tab === item.id}
              aria-controls={`panel-${item.id}`}
              onClick={() => setTab(item.id)}
              className={cn(
                "cursor-pointer rounded-full px-5 py-2.5 text-sm font-medium text-zinc-950 transition-colors duration-200 sm:text-base",
                tab === item.id ? "bg-white shadow-sm" : "hover:bg-white/60"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clinic photos */}
      <div
        role="tabpanel"
        id="panel-clinic"
        aria-labelledby="tab-clinic"
        hidden={tab !== "clinic"}
        className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4"
      >
        {photos.map((photo) => (
          <figure key={photo.id} className="group">
            <div className="relative aspect-4/5 w-full overflow-hidden rounded-2xl">
              <Image
                src={photo.image}
                alt={photo.alt}
                fill
                className="object-cover transition-[scale] duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            </div>
            <figcaption className="mt-4">
              <CardTitle as="h3" size="sm">{photo.heading}</CardTitle>
              {photo.description && <CardText className="mt-1">{photo.description}</CardText>}
            </figcaption>
          </figure>
        ))}
      </div>

      {/* Before & after cases */}
      <div
        role="tabpanel"
        id="panel-cases"
        aria-labelledby="tab-cases"
        hidden={tab !== "cases"}
        className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:mt-14 lg:grid-cols-3"
      >
        {cases.map((item) => (
          <div key={item.id}>
            <BeforeAfterCard before={item.beforeImage} after={item.afterImage} alt={item.heading} />
            <CardTitle as="h3" size="sm" className="mt-4">{item.heading}</CardTitle>
            {item.description && <CardText className="mt-1">{item.description}</CardText>}
          </div>
        ))}
      </div>
    </>
  );
}
