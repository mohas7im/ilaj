import Image from "next/image";
import Section from "@/components/website/common/Section";
import SectionLabel from "@/components/website/common/SectionLabel";
import SectionTitle, { Highlight } from "@/components/website/common/SectionTitle";
import SectionDescription from "@/components/website/common/SectionDescription";
import CardTitle from "@/components/website/common/CardTitle";
import CardText from "@/components/website/common/CardText";
import { getWebsiteWhyChooseUsItems } from "../_lib/why-choose-us";

// Admin "Why Choose Us" items. Hidden until there is one.
export default async function WhyChooseUsSection() {
  const items = await getWebsiteWhyChooseUsItems();
  if (items.length === 0) return null;

  return (
    <Section>

        {/* Label */}
        <SectionLabel>WHY CHOOSE US</SectionLabel>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-0">

          {/* =================================================
              LEFT CONTENT
          ================================================== */}
          <div className="flex flex-col lg:col-span-7 lg:pr-14">

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

            {/* Feature List — spaced out so it scrolls past the pinned image */}
            <div className="mt-16 border-b border-zinc-200 lg:mt-20">

              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-baseline gap-4 border-t border-zinc-200 py-8 lg:py-12"
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

                  {/* Feature — description only when filled in admin */}
                  <div>
                    <CardTitle>{item.title}</CardTitle>
                    {item.description && (
                      <CardText className="mt-2 max-w-md">{item.description}</CardText>
                    )}
                  </div>

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
              lg:sticky
              lg:top-28
              lg:self-start
              lg:h-[min(38rem,calc(100vh-9rem))]
            "
          >
            <Image
              src="/images/why-ilaj.webp"
              alt="Dental specialists reviewing X-ray with patient at Ilaj Dental Care"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
              quality={100}
            />
          </div>

        </div>

      </Section>
  );
}
