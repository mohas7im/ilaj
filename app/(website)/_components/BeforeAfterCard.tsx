"use client";

import Image from "next/image";
import { sizedImage } from "@/lib/image";
import { useState } from "react";
import MetaText from "@/components/website/common/MetaText";

interface BeforeAfterCardProps {
  before: string;
  after: string;
  alt?: string;
}

export default function BeforeAfterCard({
  before,
  after,
  alt = "Dental transformation",
}: BeforeAfterCardProps) {
  const [position, setPosition] = useState(50);

  return (
    <div className="relative aspect-9/5 w-full overflow-hidden rounded-2xl">
      {/* AFTER IMAGE - Background */}
      <Image
        src={sizedImage(after, 1000)}
        alt={`${alt} after`}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 33vw"
      />

      {/* BEFORE IMAGE */}
      <div
        className="absolute inset-y-0 left-0 overflow-hidden"
        style={{ width: `${position}%` }}
      >
        <div className="relative h-full w-full">
          <Image
            src={sizedImage(before, 1000)}
            alt={`${alt} before`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      </div>

      {/* Divider */}
      <div
        className="absolute inset-y-0 z-10 w-px bg-white"
        style={{ left: `${position}%` }}
      />

      {/* Drag Handle */}
      <div
        className="
          absolute
          top-1/2
          z-20
          flex
          h-9
          w-9
          -translate-x-1/2
          -translate-y-1/2
          items-center
          justify-center
          rounded-full
          bg-white
          text-xs
          font-bold
          text-zinc-900
          shadow-md
        "
        style={{ left: `${position}%` }}
      >
        ‹›
      </div>

      {/* BEFORE label */}
      <MetaText as="span" tone="light" className="absolute bottom-3 left-3 z-20">
        BEFORE
      </MetaText>

      {/* AFTER label */}
      <MetaText as="span" tone="light" className="absolute bottom-3 right-3 z-20">
        AFTER
      </MetaText>

      {/* Invisible Slider */}
      <input
        type="range"
        min="0"
        max="100"
        value={position}
        onChange={(e) => setPosition(Number(e.target.value))}
        className="
          absolute
          inset-0
          z-30
          h-full
          w-full
          cursor-ew-resize
          opacity-0
        "
        aria-label="Compare before and after"
      />
    </div>
  );
}
