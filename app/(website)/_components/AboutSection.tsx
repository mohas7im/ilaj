import Image from "next/image";
import Link from "next/link";
import Button from "@/components/website/ui/Button";

const STATS = [
  {
    label: "Years of Experience",
    value: "10+",
    description: "Clinical excellence.",
  },
  {
    label: "Satisfaction",
    value: "99%",
    description: "Recommended by patients.",
  },
  {
    label: "Specialists",
    value: "15",
    description: "Across all dental fields.",
  },
];

export default function AboutSection() {
  return (
    <section className="w-full bg-white py-10 text-zinc-950 sm:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">

        {/* Section Label */}
        <div className="mb-6 sm:mb-8">
          <span className="inline-flex items-center rounded-full border border-zinc-200 px-4 py-2 font-heading text-xs font-semibold uppercase tracking-wider text-zinc-800">
            ABOUT ILAJ DENTAL CARE
          </span>
        </div>

        {/* Top Row */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-14">

          {/* Heading */}
          <div className="lg:col-span-1">
            <h2 className="font-heading text-3xl font-normal leading-[1.15] tracking-tight sm:text-4xl lg:text-[36px]">
              <span className="text-brand">
                Ilaj Dental Care -
              </span>
              <br />
              <span className="text-zinc-950">
                The Story Behind Every Smile
              </span>
            </h2>
          </div>

          {/* Paragraph + CTA */}
          <div className="lg:col-span-2">
            <p className="max-w-4xl text-base font-medium leading-[1.45] text-zinc-950 sm:text-lg lg:text-[19px]">
              At Ilaj Dental Care, we take pride in delivering exceptional
              dental care with a focus on quality, comfort, and trust. Backed
              by years of experience, our expert team has helped thousands of
              patients achieve healthy and confident smiles through advanced,
              safe, and personalized treatments.
            </p>

            <div className="mt-20 flex justify-start">
              <Link href="/about">
                <Button variant="primary">
                  Our Story
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="mt-16 grid grid-cols-1 gap-10 sm:mt-20 lg:grid-cols-3 lg:gap-14 lg:items-center">

          {/* Image */}
          <div className="lg:col-span-1">
            <div className="relative aspect-[1.5/1] w-full overflow-hidden rounded-3xl shadow-sm">
              <Image
                src="/images/about-dental.jpg"
                alt="Dentist consulting patient with teeth model"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:gap-10">

              {STATS.map((stat) => (
                <div key={stat.label}>

                  <h3 className="text-base font-semibold text-zinc-950 sm:text-lg">
                    {stat.label}
                  </h3>

                  <div className="mt-4 border-t border-zinc-200 pt-8 font-heading text-5xl font-normal leading-none tracking-tight text-zinc-950 sm:text-6xl lg:text-[64px]">
                    {stat.value}
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-zinc-700 sm:text-base">
                    {stat.description}
                  </p>

                </div>
              ))}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}