import { ArrowRight } from "lucide-react";

const CLIENT_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop&crop=faces",
];

export default function Hero() {
  return (
    <section className="relative w-full h-screen overflow-hidden bg-neutral-950 flex flex-col justify-between">
      <img
        src="/images/hero-bg.png"
        alt="Hero background"
        className="absolute inset-0 w-full h-full object-cover object-[90%_-50px]"
      />
      {/* Glossy & Subtle Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/55 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-white/[0.12] pointer-events-none" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full pt-32 md:pt-36">
        <div className="max-w-7xl space-y-7">
          <h1 className="font-heading font-semibold text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[84px] leading-[1.05] tracking-tight max-w-7xl">
            Your Smile, Our Priority : Expert Dental Care You Trust
          </h1>

          {/* Happy Clients Badge */}
          <div className="rounded-xl border border-white/35 bg-white/[0.12] backdrop-blur-md px-5 py-5.5 w-[275px] sm:w-[290px] space-y-5 shadow-xl transition-transform duration-200 hover:scale-[1.02]">
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
    </section>
  );
}
