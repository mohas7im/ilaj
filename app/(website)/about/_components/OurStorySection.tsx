import Image from "next/image";
import Link from "next/link";
import { Target } from "lucide-react";
import Button from "@/components/website/ui/Button";
import Section from "@/components/website/common/Section";
import SectionLabel from "@/components/website/common/SectionLabel";
import SectionTitle, { Highlight } from "@/components/website/common/SectionTitle";
import SectionDescription from "@/components/website/common/SectionDescription";
import StatsList from "@/components/website/common/StatsList";
import CardTitle from "@/components/website/common/CardTitle";
import CardText from "@/components/website/common/CardText";
import { getClinicStats } from "@/lib/data/settings";

export default async function OurStorySection() {
  const stats = await getClinicStats();

  return (
    <Section>

        {/* =====================================================
            INTRO
        ====================================================== */}
        <SectionLabel>OUR STORY</SectionLabel>

        <SectionTitle>
          Built Around One Simple Belief —{" "}
          <Highlight>Every Smile Matters</Highlight>
        </SectionTitle>

        <SectionDescription className="mt-5">
          Ilaj Dental Care was created with a simple goal: to make
          professional dental care feel more comfortable, accessible, and
          reassuring. From routine checkups to advanced treatments, we focus
          on understanding each patient’s needs and creating a treatment
          experience that feels clear and stress-free. We combine clinical
          expertise, modern technology, and genuine attention to detail to
          help our patients maintain healthier smiles and greater confidence.
        </SectionDescription>

        {/* =====================================================
            MISSION / IMAGE / VISION
        ====================================================== */}
        {/* Shared rows (icon / space / title / text) so Mission and Vision titles line up */}
        <div className="mt-14 grid grid-cols-1 gap-4 md:min-h-96 md:grid-cols-3 md:grid-rows-[auto_1fr_auto_auto] md:gap-y-0 lg:mt-16 lg:min-h-128">

          <ValueCard
            icon={
              <Image
                src="/images/about/mission-icon.webp"
                alt="Mission icon"
                width={40}
                height={40}
                className="size-10 object-contain"
              />
            }
            title="Mission"
          >
            Our mission is to deliver high-quality dental care in an
            environment where patients feel heard, respected, and
            comfortable. We strive to make modern dentistry accessible
            while maintaining the highest standards of care, safety, and
            professionalism.
          </ValueCard>

          <div className="reveal-image relative min-h-96 overflow-hidden rounded-2xl md:row-span-4 md:min-h-0">
            <Image
              src="/images/story/joyful-smile.webp"
              alt="Happy patient showing a healthy, radiant smile at Ilaj Dental Care"
              fill
              unoptimized
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 500px"
            />
          </div>

          <ValueCard icon={<Target className="size-10 text-zinc-950" strokeWidth={2.25} aria-hidden="true" />} title="Vision">
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

          <StatsList stats={stats} className="lg:w-2/3" />

          <Link href="/treatments" className="shrink-0 self-center lg:self-auto">
            <Button variant="primary">
              Check Our Treatments
            </Button>
          </Link>

        </div>

      </Section>
  );
}

function ValueCard({
  logo,
  icon,
  title,
  children,
}: {
  logo?: React.ReactNode;
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="reveal flex min-h-96 flex-col rounded-2xl border border-zinc-200 bg-zinc-50 p-8 md:row-span-4 md:grid md:min-h-0 md:grid-rows-subgrid lg:py-10 lg:pl-10 lg:pr-6">

      <div className="flex flex-col gap-4 md:row-start-1">
        {logo && <div>{logo}</div>}
        <div>{icon}</div>
      </div>

      <CardTitle tone="brand" className="mt-auto pt-12 md:row-start-3 md:mt-0">
        {title}
      </CardTitle>

      <CardText className="mt-3 md:row-start-4">{children}</CardText>

    </div>
  );
}
