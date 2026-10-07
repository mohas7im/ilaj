import Image from "next/image";
import Link from "next/link";
import Button from "@/components/website/ui/Button";
import Section from "@/components/website/common/Section";
import SectionLabel from "@/components/website/common/SectionLabel";
import SectionTitle, { Highlight } from "@/components/website/common/SectionTitle";
import SectionDescription from "@/components/website/common/SectionDescription";
import StatsList from "@/components/website/common/StatsList";
import { getClinicStats } from "@/lib/data/settings";

export default async function AboutSection() {
  const stats = await getClinicStats();

  return (
    <Section>

        {/* Section Label */}
        <SectionLabel>ABOUT ILAJ DENTAL CARE</SectionLabel>

        {/* Top Row */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-8 lg:gap-14">

          {/* Heading */}
          <div className="lg:col-span-3">
            <SectionTitle>
              <Highlight>Ilaj Dental Care —</Highlight>{" "}
              The Story Behind Every Smile
            </SectionTitle>
          </div>

          {/* Paragraph + CTA */}
          <div className="lg:col-span-5">
            <SectionDescription className="max-w-4xl">
              At Ilaj Dental Care, we take pride in delivering exceptional
              dental care with a focus on quality, comfort, and trust. Backed
              by years of experience, our team has helped patients achieve
              healthy, confident smiles through advanced, safe, and
              personalized treatment plans.
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
        <div className="mt-16 grid grid-cols-1 gap-10 sm:mt-20 lg:grid-cols-8 lg:gap-14 lg:items-center">

          {/* Image */}
          <div className="lg:col-span-3">
            <div className="reveal-image relative aspect-3/2 w-full overflow-hidden rounded-3xl shadow-sm">
              <Image
                src="/images/about-dental.webp"
                alt="Dentist performing a dental procedure under operatory light at Ilaj Dental Care"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="lg:col-span-5">
            <StatsList stats={stats} />
          </div>

        </div>

      </Section>
  );
}