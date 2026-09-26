import Image from "next/image";
import Link from "next/link";
import Button from "@/components/website/ui/Button";
import SectionLabel from "@/components/website/common/SectionLabel";
import SectionTitle, { Highlight } from "@/components/website/common/SectionTitle";
import SectionDescription from "@/components/website/common/SectionDescription";
import StatsList from "@/components/website/common/StatsList";

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
        <SectionLabel>ABOUT ILAJ DENTAL CARE</SectionLabel>

        {/* Top Row */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-14">

          {/* Heading */}
          <div className="lg:col-span-1">
            <SectionTitle>
              <Highlight>Ilaj Dental Care -</Highlight>{" "}
              The Story Behind Every Smile
            </SectionTitle>
          </div>

          {/* Paragraph + CTA */}
          <div className="lg:col-span-2">
            <SectionDescription className="max-w-4xl">
              At Ilaj Dental Care, we take pride in delivering exceptional
              dental care with a focus on quality, comfort, and trust. Backed
              by years of experience, our expert team has helped thousands of
              patients achieve healthy and confident smiles through advanced,
              safe, and personalized treatments.
            </SectionDescription>

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
            <StatsList stats={STATS} />
          </div>

        </div>

      </div>
    </section>
  );
}