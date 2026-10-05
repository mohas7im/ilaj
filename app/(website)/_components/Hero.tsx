import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Button from "@/components/website/ui/Button";
import { getOpeningHours, getSettings, toCounter } from "@/lib/data/settings";

const CLIENT_AVATARS = [
  "/images/hero/avatars/avatar-1.webp",
  "/images/hero/avatars/avatar-2.webp",
  "/images/hero/avatars/avatar-3.webp",
  "/images/hero/avatars/avatar-4.webp",
];



const HEADLINE = "Your Smile, Our Priority: Expert Dental Care You Trust";

export default async function Hero() {
  const [settings, openingHours] = await Promise.all([getSettings(), getOpeningHours()]);
  const patients = toCounter(settings.totalPatients);

  return (
    <section className="relative w-full min-h-svh flex flex-col justify-between bg-neutral-950 overflow-hidden">
      {/* Background Image — wrapper drifts on scroll (parallax), image settles in (hero-image) */}
      <div className="parallax absolute inset-0">
        {/* Portrait crop on phones and tablets, wide shot from lg up — CSS shows one of them */}
        <Image
          src="/images/hero/ilaj-dental-care-dentist-checkup-smiling-patient-mobile.webp"
          alt="Dental examination at Ilaj Dental Care"
          fill
          priority
          sizes="100vw"
          quality={90}
          className="hero-image object-cover lg:hidden"
        />
        <Image
          src="/images/hero/ilaj-dental-care-dentist-checkup-smiling-patient.webp"
          alt="Dramatic Dental Examination at Ilaj Dental Care"
          fill
          priority
          sizes="100vw"
          quality={90}
          className="hero-image object-cover max-lg:hidden"
        />
      </div>
      {/* Shade only where text sits so the face stays bright: top (nav/headline)
          and bottom (info/buttons) everywhere, plus the left side on desktop */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 pointer-events-none" />
      <div className="absolute inset-0 hidden lg:block bg-gradient-to-r from-black/50 via-black/15 via-45% to-transparent pointer-events-none" />

      {/* Top / Main Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-24 sm:pt-28 lg:pt-32">
        <div className="max-w-7xl space-y-4 sm:space-y-5">
          <h1 className="font-heading font-semibold text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight max-w-7xl">
            {/* Each word rises out of its own mask, one after another */}
            {HEADLINE.split(" ").map((word, i) => (
              <span key={i}>
                <span className="hero-word">
                  <span style={{ "--i": i } as React.CSSProperties}>{word}</span>
                </span>{" "}
              </span>
            ))}
          </h1>

          {/* Happy Clients Badge */}
          {patients && (
            <div className="hero-fade max-lg:[@media(max-height:740px)]:hidden rounded-xl border border-white/35 bg-white/12 backdrop-blur-md px-5 py-4 w-68 sm:w-72 space-y-4 shadow-xl transition-transform duration-200 hover:scale-102">
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2.5 items-center">
                  {CLIENT_AVATARS.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt="Smiling dental patient"
                      className="size-9 rounded-full object-cover border border-white/60 shadow-xs"
                    />
                  ))}
                </div>
                <span className="font-bold text-white text-2xl tracking-tight leading-none">
                  {patients}
                </span>
              </div>

              <div className="flex items-end justify-between pt-1">
                <span className="text-xs sm:text-sm font-medium text-white/95 leading-tight">
                  Happy Patients,<br />Trusted Care
                </span>
                <ArrowRight className="w-6 h-6 text-white/95 stroke-2 shrink-0 mb-0.5" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Hero Bar */}
      <div style={{ "--delay": "0.8s" } as React.CSSProperties} className="hero-fade relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-6 sm:pb-10 pt-6 sm:pt-8 mt-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8 lg:gap-12">
          {/* Left: Address & Opening Hours */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-16 lg:gap-20 font-heading">
            {settings.address && (
              <div>
                <span className="block font-heading font-semibold tracking-widest uppercase text-white text-sm mb-1 sm:mb-2">
                  ADDRESS
                </span>
                <p className="max-w-xs whitespace-pre-line font-heading text-sm text-white/90 leading-relaxed font-medium">
                  {settings.address}
                </p>
              </div>
            )}

            <div>
              <span className="block font-heading font-semibold tracking-widest uppercase text-white text-sm mb-1 sm:mb-2">
                OPENING HOURS
              </span>
              <p className="whitespace-pre-line font-heading text-sm text-white/90 leading-relaxed font-medium">
                {openingHours.join("\n")}
              </p>
            </div>
          </div>

          {/* Right: Description & Action Buttons */}
          <div className="flex flex-col items-start gap-4">
            {/* Hidden on phones — the buttons take its place */}
            <p className="max-md:hidden text-base text-white leading-relaxed max-w-md font-normal">
              Ilaj Dental Care combines modern technology with gentle, affordable treatment — from routine checkups to advanced procedures.
            </p>

            <div className="flex flex-wrap items-center gap-3.5">
              <Link href="/contact">
                <Button variant="primary">
                  Contact Ilaj Team
                </Button>
              </Link>
              <Link href="/treatments">
                <Button variant="secondary">
                  Our Treatments
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
