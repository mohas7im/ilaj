export default function Hero() {
  return (
    <section className="relative w-full h-screen overflow-hidden bg-neutral-950">
      <img
        src="/images/hero-bg.png"
        alt="Hero background"
        className="w-full h-full object-cover object-[90%_-50px]"
      />
      {/* Glossy & Subtle Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/55 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-white/[0.12] pointer-events-none" />
    </section>
  );
}
