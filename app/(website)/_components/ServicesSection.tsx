import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionLabel from "@/components/website/common/SectionLabel";
import SectionTitle, { Highlight } from "@/components/website/common/SectionTitle";
import SectionDescription from "@/components/website/common/SectionDescription";
import CardTitle from "@/components/website/common/CardTitle";
import CardText from "@/components/website/common/CardText";
import Button from "@/components/website/ui/Button";

const SERVICES = [
  {
    number: "01//",
    title: "Teeth Cleaning",
    description:
      "Teeth cleaning removes plaque and stains missed by brushing. Our process keeps teeth healthy and ensures a confident smile.",
    images: [
      "/images/services/teeth-cleaning-1.jpg",
      "/images/services/teeth-cleaning-2.jpg",
    ],
  },
  {
    number: "02//",
    title: "Teeth Whitening",
    description:
      "Enhance your smile with our safe and effective teeth whitening treatments. We help remove deep stains and discoloration.",
    images: [
      "/images/services/teeth-whitening-1.jpg",
      "/images/services/teeth-whitening-2.jpg",
    ],
  },
  {
    number: "03//",
    title: "Dental Implants",
    description:
      "Dental implants are a long-lasting solution for missing teeth. They look, feel, and function like natural teeth, helping restore your smile",
    images: [
      "/images/services/dental-implants-1.jpg",
      "/images/services/dental-implants-2.jpg",
    ],
  },
  {
    number: "04//",
    title: "Orthodontics",
    description:
      "Achieve a straighter, healthier smile with personalized orthodontic treatments designed around your needs.",
    images: [
      "/images/services/orthodontics-1.jpg",
      "/images/services/orthodontics-2.jpg",
    ],
  },
];

export default function ServicesSection() {
  return (
    <section className="w-full bg-white text-zinc-950">

      {/* =====================================================
          SECTION HEADER
      ====================================================== */}
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">

        {/* Label */}
        <SectionLabel>OUR DENTAL SERVICES</SectionLabel>

        {/* Header */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-10 lg:gap-14">

          {/* Heading */}
          <div className="lg:col-span-6">
            <SectionTitle>
              We Provide A Wide Range
              <br />
              Of <Highlight>Dental Services</Highlight>
            </SectionTitle>
          </div>

          {/* Short Description */}
          <div className="flex items-end lg:col-span-4 lg:justify-end">
            <SectionDescription className="max-w-[372px]">
              We offer a wide range of treatments to keep your
              smile healthy and beautiful.
            </SectionDescription>
          </div>

        </div>
      </div>

      {/* =====================================================
          SERVICES
      ====================================================== */}
      <div className="w-full">

        {SERVICES.map((service, index) => (
          <article
            key={service.number}
            className={`
              w-full
              border-t
              border-zinc-100
              ${index % 2 === 0 ? "bg-zinc-50" : "bg-white"}
            `}
          >
            <div
              className="
                mx-auto
                grid
                max-w-7xl
                grid-cols-1
                gap-10
                px-5
                py-12
                sm:px-6
                sm:py-14
                lg:grid-cols-[minmax(0,2fr)_minmax(0,6fr)_minmax(0,4fr)]
                lg:gap-6
                lg:px-8
                lg:py-9
              "
            >

              {/* =================================================
                  NUMBER
              ================================================== */}
              <div>
                <CardTitle as="span" tone="brand">
                  {service.number}
                </CardTitle>
              </div>

              {/* =================================================
                  CONTENT
              ================================================== */}
              <div className="flex flex-col">

                <CardTitle>{service.title}</CardTitle>

                <CardText className="mt-3 max-w-xs">
                  {service.description}
                </CardText>

                {/* CTA */}
                <Link
                  href="/contact"
                  className="
                    group
                    mt-auto
                    inline-flex
                    w-fit
                    items-center
                    gap-4
                    pt-12
                    text-[15px]
                    font-semibold
                    text-brand
                  "
                >
                  <span>
                    Contact To Know More
                  </span>

                  <ArrowRight
                    aria-hidden="true"
                    className="
                      h-5
                      w-5
                      stroke-2
                      transition-transform
                      duration-200
                      group-hover:translate-x-1
                    "
                  />
                </Link>

              </div>

              {/* =================================================
                  IMAGES
              ================================================== */}
              <div
                className="
                  grid
                  grid-cols-2
                  gap-4
                "
              >
                {service.images.map((image, imageIndex) => (
                  <div
                    key={image}
                    className="
                      relative
                      aspect-square
                      w-full
                      overflow-hidden
                      rounded-xl
                    "
                  >
                    <Image
                      src={image}
                      alt={`${service.title} ${imageIndex + 1}`}
                      fill
                      className="
                        object-cover
                        transition-transform
                        duration-500
                        hover:scale-105
                      "
                      sizes="(max-width: 640px) 45vw, (max-width: 1024px) 40vw, 220px"
                    />
                  </div>
                ))}
              </div>

            </div>
          </article>
        ))}

      </div>

      {/* =====================================================
          ALL SERVICES
      ====================================================== */}
      <div className="flex justify-center px-5 py-12">
        <Link href="/services">
          <Button variant="primary">All Services</Button>
        </Link>
      </div>
    </section>
  );
}
