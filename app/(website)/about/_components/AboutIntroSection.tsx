import Image from "next/image";
import Link from "next/link";
import Button from "@/components/website/ui/Button";
import SectionLabel from "@/components/website/common/SectionLabel";
import SectionTitle, { Highlight } from "@/components/website/common/SectionTitle";
import SectionDescription from "@/components/website/common/SectionDescription";

export default function AboutIntroSection() {
  return (
    <section className="w-full bg-zinc-50 text-zinc-950">
      <div className="mx-auto max-w-7xl px-5 pb-12 pt-12 sm:px-6 lg:px-8 lg:pt-15">

        {/* Label — above both columns, so the images line up with the heading */}
        <SectionLabel>ABOUT ILAJ DENTAL CARE</SectionLabel>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,581px)] lg:gap-10">

          {/* =====================================================
              LEFT CONTENT
          ====================================================== */}
          <div className="flex flex-col">

            <SectionTitle as="h1">
              Where <Highlight>Better Dentistry</Highlight>
              <br />
              Begins With Better Care
            </SectionTitle>

            <SectionDescription className="mt-2.5">
              At Ilaj Dental Care, we believe a great dental experience is
              about more than treating teeth. It’s about understanding people,
              earning trust, and making every visit feel comfortable. With
              modern dentistry and a patient-first approach, we’re here to make
              quality dental care simpler, gentler, and more personal.
            </SectionDescription>

            {/* CTA — bottom-aligned with the images */}
            <div className="mt-10 lg:mt-auto lg:pt-12">
              <Link href="/contact">
                <Button variant="primary">
                  Contact Ilaj team
                </Button>
              </Link>
            </div>

          </div>

          {/* =====================================================
              RIGHT IMAGE COLLAGE
          ====================================================== */}
          <div className="grid h-[420px] grid-cols-2 gap-3.75 sm:h-[520px] lg:h-[643px]">

            {/* Tall Image */}
            <div className="relative overflow-hidden rounded-[18px]">
              <Image
                src="/images/about/about-main.jpg"
                alt="Dentist providing dental treatment"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 50vw, 283px"
              />
            </div>

            {/* Two Stacked Images */}
            <div className="grid grid-rows-2 gap-3.75">
              <div className="relative overflow-hidden rounded-[18px]">
                <Image
                  src="/images/about/about-small-1.jpg"
                  alt="Dental care model"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 283px"
                />
              </div>

              <div className="relative overflow-hidden rounded-[18px]">
                <Image
                  src="/images/about/about-small-2.jpg"
                  alt="Dental hygiene demonstration"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 283px"
                />
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
