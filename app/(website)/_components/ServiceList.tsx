import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/website/common/Section";
import CardTitle from "@/components/website/common/CardTitle";
import CardText from "@/components/website/common/CardText";

export const SERVICES = [
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

type Service = (typeof SERVICES)[number];

/**
 * The service rows, shared by the home section and the Services page.
 * - boxed = false: full-width gray/white bands, content centered inside (home)
 * - boxed = true:  rows inside a bordered box within the page container (Services page)
 */
export default function ServiceList({ boxed = false }: { boxed?: boolean }) {
  const rows = SERVICES.map((service, index) => (
    <article
      key={service.number}
      className={cn(
        index % 2 === 0 ? "bg-zinc-50" : "bg-white",
        index > 0 && "border-t border-zinc-100"
      )}
    >
      {boxed ? (
        <div className="px-6 py-10 sm:px-8 lg:px-12 lg:py-10">
          <ServiceRow service={service} />
        </div>
      ) : (
        <Container className="py-12 sm:py-14 lg:py-9">
          <ServiceRow service={service} />
        </Container>
      )}
    </article>
  ));

  return boxed ? (
    <div className="overflow-hidden border border-zinc-100">{rows}</div>
  ) : (
    <div className="border-t border-zinc-100">{rows}</div>
  );
}

function ServiceRow({ service }: { service: Service }) {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-6">

      {/* Number */}
      <div className="lg:col-span-2">
        <CardTitle as="span" tone="brand">
          {service.number}
        </CardTitle>
      </div>

      {/* Content */}
      <div className="flex flex-col lg:col-span-6">
        <CardTitle>{service.title}</CardTitle>

        <CardText className="mt-3 max-w-sm">
          {service.description}
        </CardText>

        <Link
          href="/contact"
          className="group mt-auto inline-flex w-fit items-center gap-4 pt-8 text-sm font-semibold text-brand"
        >
          <span>Contact To Know More</span>
          <ArrowRight
            aria-hidden="true"
            className="size-5 transition-transform duration-200 group-hover:translate-x-1"
          />
        </Link>
      </div>

      {/* Images */}
      <div className="grid grid-cols-2 gap-4 lg:col-span-4">
        {service.images.map((image, imageIndex) => (
          <div key={image} className="relative aspect-square w-full overflow-hidden rounded-xl">
            <Image
              src={image}
              alt={`${service.title} ${imageIndex + 1}`}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
              sizes="(max-width: 1024px) 45vw, 220px"
            />
          </div>
        ))}
      </div>

    </div>
  );
}
