"use client";

import { getImageProps } from "next/image";

// Portrait crop on phones and tablets, wide shot from lg up. A <picture> lets the
// browser download only the one it shows (two priority <Image>s preload both).
// Client component: vinext's next/image is a client module, so getImageProps
// throws when called from a server component.
const COMMON = { alt: "Dental examination at Ilaj Dental Care", fill: true, sizes: "100vw", quality: 90 };

export default function HeroImage() {
  const { props: desktop } = getImageProps({
    ...COMMON,
    src: "/images/hero/ilaj-dental-care-dentist-checkup-smiling-patient.webp",
  });
  const { props: mobile } = getImageProps({
    ...COMMON,
    src: "/images/hero/ilaj-dental-care-dentist-checkup-smiling-patient-mobile.webp",
    priority: true,
  });

  return (
    <picture>
      <source media="(min-width: 1024px)" srcSet={desktop.srcSet} sizes={desktop.sizes} />
      {/* eslint-disable-next-line @next/next/no-img-element -- art-directed <picture>, props from getImageProps */}
      <img {...mobile} className="hero-image object-cover" />
    </picture>
  );
}
