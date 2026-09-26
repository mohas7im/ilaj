import Image from "next/image";
import Link from "next/link";
import { Clover, Target, type LucideIcon } from "lucide-react";
import Button from "@/components/website/ui/Button";
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

export default function OurStorySection() {
  return (
    <section className="w-full bg-white text-zinc-950">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">

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
        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3 lg:mt-28">

          <ValueCard icon={Clover} title="Mission">
            Our mission is to deliver high-quality dental care in an
            environment where patients feel heard, respected, and
            comfortable. We strive to make modern dentistry accessible
            while maintaining the highest standards of care, safety, and
            professionalism.
          </ValueCard>

          <div className="relative min-h-[420px] overflow-hidden rounded-[18px]">
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

          <StatsList stats={STATS} className="lg:w-[787px]" />

          <Link href="/services" className="shrink-0">
            <Button variant="primary">
              Check Our Services
            </Button>
          </Link>

        </div>

      </div>
    </section>
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
    <div className="flex min-h-[420px] flex-col rounded-[18px] border border-zinc-200 bg-zinc-50 p-8 lg:min-h-[507px] lg:py-9.5 lg:pl-9.5 lg:pr-6">

      <Icon className="size-10 text-zinc-950" strokeWidth={2.25} aria-hidden="true" />

      <div className="mt-auto pt-12">
        <CardTitle tone="brand">{title}</CardTitle>

        <CardText className="mt-3">{children}</CardText>
      </div>

    </div>
  );
}
