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
    <section className="w-full bg-white text-zinc-950 py-10 sm:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">

        {/* Section Label */}
        <div className="mb-6 sm:mb-8">
          <span
            className="
              inline-flex
              items-center
              rounded-full
              border border-zinc-200
              px-4 py-2
              text-xs
              font-semibold
              uppercase
              tracking-wider
              text-zinc-800
              font-heading
            "
          >
            ABOUT ILAJ DENTAL CARE
          </span>
        </div>

        {/* =====================================================
            TOP ROW
            Heading              Paragraph + Button
        ====================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-10 lg:gap-14">

          {/* Heading */}
          <div className="lg:col-span-4">
            <h2
              className="
                font-heading
                text-3xl
                sm:text-4xl
                lg:text-[36px]
                leading-[1.15]
                tracking-tight
                font-normal
              "
            >
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
          <div className="lg:col-span-6">

            <p
              className="
                max-w-4xl
                text-base
                sm:text-lg
                lg:text-[19px]
                leading-[1.45]
                font-medium
                text-zinc-950
              "
            >
              At Ilaj Dental Care, we take pride in delivering exceptional
              dental care with a focus on quality, comfort, and trust. Backed
              by years of experience, our expert team has helped thousands of
              patients achieve healthy and confident smiles through advanced,
              safe, and personalized treatments.
            </p>

            {/* Button */}
            <div className="mt-20 flex justify-start lg:justify-start">
              <Link href="/about">
                <Button variant="primary">
                  Our Story
                </Button>
              </Link>
            </div>

          </div>
        </div>

        {/* =====================================================
            BOTTOM ROW
            Image                 Stats
        ====================================================== */}
        <div className="mt-16 sm:mt-20 lg:mt-20 grid grid-cols-1 lg:grid-cols-10 gap-10 lg:gap-14">

          {/* Image */}
          <div className="lg:col-span-4">
            <div
              className="
                relative
                w-full
                max-w-[470px]
                aspect-[1.5/1]
                overflow-hidden
                rounded-3xl
                shadow-sm
              "
            >
              <Image
                src="/images/about-dental.jpg"
                alt="Dentist consulting patient with teeth model"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 470px"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="lg:col-span-6 self-start">

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-10">

              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="border-t border-zinc-200 pt-5"
                >
                  {/* Label */}
                  <h3
                    className="
                      text-base
                      sm:text-lg
                      font-semibold
                      text-zinc-950
                    "
                  >
                    {stat.label}
                  </h3>

                  {/* Value */}
                  <div
                    className="
                      mt-8
                      font-heading
                      text-5xl
                      sm:text-6xl
                      lg:text-[64px]
                      leading-none
                      tracking-tight
                      font-normal
                      text-zinc-950
                    "
                  >
                    {stat.value}
                  </div>

                  {/* Description */}
                  <p
                    className="
                      mt-4
                      text-sm
                      sm:text-base
                      leading-relaxed
                      text-zinc-700
                    "
                  >
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