import Image from "next/image";
import Section from "@/components/website/common/Section";
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
    <Section>

        {/* Label */}
        <SectionLabel>WHY CHOOSE US</SectionLabel>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-0">

          {/* =================================================
              LEFT CONTENT
          ================================================== */}
          <div className="flex flex-col lg:col-span-7">

            {/* Heading */}
            <SectionTitle>
              What Makes Ilaj
              <br />
              <Highlight>Dental Care Different</Highlight>
            </SectionTitle>

            <SectionDescription className="mt-2.5 max-w-md">
              Experience and compassion — our team delivers
              high-quality care in a patient-first environment.
            </SectionDescription>

            {/* Feature List — sits at the bottom, level with the image */}
            <div className="mt-16 space-y-8 lg:mt-auto lg:pt-16">

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
              h-96
              lg:col-span-5
              w-full
              overflow-hidden
              rounded-2xl
              sm:h-128
              lg:h-152
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

      </Section>
  );
}
