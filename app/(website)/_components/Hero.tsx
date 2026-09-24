import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Button from "@/components/website/ui/Button";

const CLIENT_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop&crop=faces",
];

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen flex flex-col justify-between bg-neutral-950 overflow-hidden">
      {/* Background Image */}
      <img
        src="/images/hero-bg.png"
        alt="Hero background"
        className="absolute inset-0 w-full h-full object-cover object-[90%_-50px]"
      />
      {/* Glossy & Subtle Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/60 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-white/[0.12] pointer-events-none" />

      {/* Top / Main Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-24 sm:pt-28 lg:pt-32">
        <div className="max-w-7xl space-y-5">
          <h1 className="font-heading font-semibold text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[80px] leading-[1.06] tracking-tight max-w-7xl">
            Your Smile, Our Priority : Expert Dental Care You Trust
          </h1>

          {/* Happy Clients Badge */}
          <div className="rounded-xl border border-white/35 bg-white/[0.12] backdrop-blur-md px-5 py-4.5 w-[275px] sm:w-[290px] space-y-4 shadow-xl transition-transform duration-200 hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div className="flex -space-x-2.5 items-center">
                {CLIENT_AVATARS.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="Happy Client"
                    className="w-8.5 h-8.5 rounded-full object-cover border-[1.5px] border-white/60 shadow-xs"
                  />
                ))}
              </div>
              <span className="font-bold text-white text-2xl sm:text-[26px] tracking-tight leading-none">
                10K+
              </span>
            </div>

            <div className="flex items-end justify-between pt-1">
              <span className="text-[13px] sm:text-sm font-medium text-white/95 leading-tight">
                Happy Trusted<br />Client In the World
              </span>
              <ArrowRight className="w-6 h-6 text-white/95 stroke-[2] shrink-0 mb-0.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Hero Bar */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-8 sm:pb-10 pt-8 mt-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 lg:gap-12">
          {/* Left: Address & Opening Hours */}
          <div className="flex flex-col sm:flex-row gap-10 sm:gap-16 lg:gap-20 font-heading">
            <div>
              <span className="block font-heading font-semibold tracking-[0.08em] uppercase text-white text-sm sm:text-[15px] mb-2">
                ADDRESS
              </span>
              <p className="font-heading text-[14px] sm:text-[15px] text-white/90 leading-relaxed font-medium">
                ScaleUnio Advisory, 27 Alderwick Street,
                <br />
                Level 6, Canary Wharf, LondonE14 9DX, UK
              </p>
            </div>

            <div>
              <span className="block font-heading font-semibold tracking-[0.08em] uppercase text-white text-sm sm:text-[15px] mb-2">
                OPENING HOURS
              </span>
              <p className="font-heading text-[14px] sm:text-[15px] text-white/90 leading-relaxed font-medium">
                Mon – Sat: 9:00 AM – 8:00 PM
                <br />
                Sunday: Closed
              </p>
            </div>
          </div>

          {/* Right: Description & Action Buttons */}
          <div className="flex flex-col items-start gap-4">
            <p className="text-base sm:text-[17px] text-white leading-relaxed max-w-[460px] font-normal">
              Ilaj Dental Care offers advanced, painless, affordable treatments with modern technology and expert care for a confident smile.
            </p>

            <div className="flex flex-wrap items-center gap-3.5">
              <Link href="/contact">
                <Button variant="primary">
                  Contact Ilaj Team
                </Button>
              </Link>
              <Link href="/services">
                <Button variant="secondary">
                  Our Services
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
