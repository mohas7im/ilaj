import Image from "next/image";
import SectionLabel from "@/components/website/common/SectionLabel";
import SectionTitle, { Highlight } from "@/components/website/common/SectionTitle";
import SectionDescription from "@/components/website/common/SectionDescription";
import CardTitle from "@/components/website/common/CardTitle";

const FEATURES = [
  "Experienced & Qualified Doctors",
  "Advanced Equipment",
  "Pain-Free Treatments",
  "Affordable Pricing",
  "Friendly Environment",
];

export default function WhyChooseUsSection() {
  return (
    <section className="w-full bg-white text-zinc-950 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

        {/* Label */}
        <SectionLabel>WHY CHOOSE US</SectionLabel>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-0">

          {/* =================================================
              LEFT CONTENT
          ================================================== */}
          <div className="flex flex-col">

            {/* Heading */}
            <SectionTitle>
              What Makes Ilaj
              <br />
              <Highlight>Dental Care Different</Highlight>
            </SectionTitle>

            <SectionDescription className="mt-2.5 max-w-[420px]">
              Experience and compassion — our team delivers
              high-quality care in a patient-first environment.
            </SectionDescription>

            {/* Feature List — sits at the bottom, level with the image */}
            <div className="mt-16 space-y-7.5 lg:mt-auto lg:pt-16">

              {FEATURES.map((feature, index) => (
                <div
                  key={feature}
                  className="flex items-baseline gap-4"
                >

                  {/* Number */}
                  <CardTitle
                    as="span"
                    size="sm"
                    tone="brand"
                    className="relative top-0.5 w-7 shrink-0 text-right"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </CardTitle>

                  {/* Feature */}
                  <CardTitle>{feature}</CardTitle>

                </div>
              ))}

            </div>
          </div>

          {/* =================================================
              RIGHT IMAGE
          ================================================== */}
          <div
            className="
              relative
              h-[420px]
              w-full
              overflow-hidden
              rounded-[18px]
              sm:h-[520px]
              lg:h-[612px]
            "
          >
            <Image
              src="/images/why-ilaj.jpg"
              alt="Patient smiling and looking at their teeth"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>

        </div>

      </div>
    </section>
  );
}
