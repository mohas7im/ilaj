import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Button from "@/components/website/ui/Button";
import { getOpeningHours, getSettings } from "@/lib/data/settings";

const CLIENT_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop&crop=faces",
];

const HEADLINE = "Your Smile, Our Priority : Expert Dental Care You Trust";

export default async function Hero() {
  const [settings, openingHours] = await Promise.all([getSettings(), getOpeningHours()]);

  return (
    <section className="relative w-full min-h-screen flex flex-col justify-between bg-neutral-950 overflow-hidden">
      {/* Background Image — wrapper drifts on scroll (parallax), image settles in (hero-image) */}
      <div className="parallax absolute inset-0">
        <img
          src="/images/hero-bg.png"
          alt="Hero background"
          className="hero-image w-full h-full object-cover"
        />
      </div>
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />
      {/* Glossy & Subtle Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/60 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/4 to-white/12 pointer-events-none" />

      {/* Top / Main Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-24 sm:pt-28 lg:pt-32">
        <div className="max-w-7xl space-y-5">
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
          {settings.totalPatients && (
            <div className="hero-fade rounded-xl border border-white/35 bg-white/12 backdrop-blur-md px-5 py-4 w-68 sm:w-72 space-y-4 shadow-xl transition-transform duration-200 hover:scale-102">
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2.5 items-center">
                  {CLIENT_AVATARS.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt="Happy Client"
                      className="size-9 rounded-full object-cover border border-white/60 shadow-xs"
                    />
                  ))}
                </div>
                <span className="font-bold text-white text-2xl tracking-tight leading-none">
                  {settings.totalPatients}
                </span>
              </div>

              <div className="flex items-end justify-between pt-1">
                <span className="text-xs sm:text-sm font-medium text-white/95 leading-tight">
                  Happy Trusted<br />Client In the World
                </span>
                <ArrowRight className="w-6 h-6 text-white/95 stroke-2 shrink-0 mb-0.5" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Hero Bar */}
      <div style={{ "--delay": "0.8s" } as React.CSSProperties} className="hero-fade relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-8 sm:pb-10 pt-8 mt-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 lg:gap-12">
          {/* Left: Address & Opening Hours */}
          <div className="flex flex-col sm:flex-row gap-10 sm:gap-16 lg:gap-20 font-heading">
            {settings.address && (
              <div>
                <span className="block font-heading font-semibold tracking-widest uppercase text-white text-sm mb-2">
                  ADDRESS
                </span>
                <p className="max-w-xs whitespace-pre-line font-heading text-sm text-white/90 leading-relaxed font-medium">
                  {settings.address}
                </p>
              </div>
            )}

            <div>
              <span className="block font-heading font-semibold tracking-widest uppercase text-white text-sm mb-2">
                OPENING HOURS
              </span>
              <p className="whitespace-pre-line font-heading text-sm text-white/90 leading-relaxed font-medium">
                {openingHours.join("\n")}
              </p>
            </div>
          </div>

          {/* Right: Description & Action Buttons */}
          <div className="flex flex-col items-start gap-4">
            <p className="text-base text-white leading-relaxed max-w-md font-normal">
              Ilaj Dental Care offers advanced, painless, affordable treatments with modern technology and expert care for a confident smile.
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
