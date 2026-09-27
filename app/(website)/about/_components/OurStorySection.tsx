import Image from "next/image";
import Link from "next/link";
import { Clover, Target, type LucideIcon } from "lucide-react";
import Button from "@/components/website/ui/Button";
import Section from "@/components/website/common/Section";
import SectionLabel from "@/components/website/common/SectionLabel";
import SectionTitle, { Highlight } from "@/components/website/common/SectionTitle";
import SectionDescription from "@/components/website/common/SectionDescription";
import StatsList from "@/components/website/common/StatsList";
import CardTitle from "@/components/website/common/CardTitle";
import CardText from "@/components/website/common/CardText";

const STATS = [
  {
    label: "Years of Experience",
    value: "10+",
    description: "Clinical excellence.",
  },
  {
    label: "Patients",
    value: "5000+",
    description: "Happy smiles treated.",
  },
  {
    label: "Specialists",
    value: "15",
    description: "Across all dental fields.",
  },
];

export default function OurStorySection() {
  return (
    <Section>

        {/* =====================================================
            INTRO
        ====================================================== */}
        <SectionLabel>OUR STORY</SectionLabel>

        <SectionTitle>
          Built Around One Simple Belief :{" "}
          <Highlight>Every Smile Matters</Highlight>
        </SectionTitle>

        <SectionDescription className="mt-5">
          Ilaj Dental Care Was Created With A Simple Goal: To Make
          Professional Dental Care Feel More Comfortable, Accessible, And
          Reassuring. From Routine Checkups To Advanced Treatments, We Focus
          On Understanding Each Patient’s Needs And Creating A Treatment
          Experience That Feels Clear And Stress-Free. We Combine Clinical
          Expertise, Modern Technology, And Genuine Attention To Detail To
          Help Our Patients Maintain Healthier Smiles And Greater Confidence.
        </SectionDescription>

        {/* =====================================================
            MISSION / IMAGE / VISION
        ====================================================== */}
        {/* Shared rows (icon / space / title / text) so Mission and Vision titles line up */}
        <div className="mt-14 grid grid-cols-1 gap-4 md:min-h-96 md:grid-cols-3 md:grid-rows-[auto_1fr_auto_auto] md:gap-y-0 lg:mt-28 lg:min-h-128">

          <ValueCard icon={Clover} title="Mission">
            Our mission is to deliver high-quality dental care in an
            environment where patients feel heard, respected, and
            comfortable. We strive to make modern dentistry accessible
            while maintaining the highest standards of care, safety, and
            professionalism.
          </ValueCard>

          <div className="reveal-image relative min-h-96 overflow-hidden rounded-2xl md:row-span-4 md:min-h-0">
            <Image
              src="/images/story/our-story.jpg"
              alt="Dentist providing dental treatment"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 395px"
            />
          </div>

          <ValueCard icon={Target} title="Vision">
            Our vision is to redefine dental care by fostering a
            community where every patient feels valued and empowered. We
            aim to innovate dental practices, ensuring that our services
            are not only effective but also compassionate, making every
            visit a step towards a healthier smile.
          </ValueCard>

        </div>

        {/* =====================================================
            STATS + CTA
        ====================================================== */}
        <div className="mt-14 flex flex-col gap-10 lg:mt-16 lg:flex-row lg:items-end lg:justify-between">

          <StatsList stats={STATS} className="lg:w-2/3" />

          <Link href="/services" className="shrink-0">
            <Button variant="primary">
              Check Our Services
            </Button>
          </Link>

        </div>

      </Section>
  );
}

function ValueCard({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="reveal flex min-h-96 flex-col rounded-2xl border border-zinc-200 bg-zinc-50 p-8 md:row-span-4 md:grid md:min-h-0 md:grid-rows-subgrid lg:py-10 lg:pl-10 lg:pr-6">

      <Icon className="size-10 text-zinc-950 md:row-start-1" strokeWidth={2.25} aria-hidden="true" />

      <CardTitle tone="brand" className="mt-auto pt-12 md:row-start-3 md:mt-0">
        {title}
      </CardTitle>

      <CardText className="mt-3 md:row-start-4">{children}</CardText>

    </div>
  );
}
