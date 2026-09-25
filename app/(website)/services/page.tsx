import Image from "next/image";
import Link from "next/link";

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
      "Replace missing teeth with natural-looking dental implants designed for comfort, function, and a confident smile.",
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

export default function ServicesPage() {
  return (
    <section className="w-full bg-white text-zinc-950">

      {/* =====================================================
          SECTION HEADER
      ====================================================== */}
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">

        {/* Label */}
        <div className="mb-6">
          <span
            className="
              inline-flex
              rounded-full
              border border-zinc-200
              px-4 py-2
              text-xs
              font-semibold
              uppercase
              tracking-wider
              text-zinc-800
              font-heading
            "
          >
            OUR DENTAL SERVICES
          </span>
        </div>

        {/* Header */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-10 lg:gap-14">

          {/* Heading */}
          <div className="lg:col-span-7">
            <h2
              className="
                font-heading
                text-4xl
                font-normal
                leading-[1.1]
                tracking-tight
                sm:text-5xl
                lg:text-[46px]
              "
            >
              <span className="text-zinc-950">
                We Provide A Wide Range
              </span>

              <br />

              <span className="text-zinc-950">
                Of{" "}
              </span>

              <span className="text-brand">
                Dental Services
              </span>
            </h2>
          </div>

          {/* Short Description */}
          <div className="flex items-end lg:col-span-3">
            <p
              className="
                max-w-md
                text-base
                leading-relaxed
                text-zinc-900
                sm:text-lg
              "
            >
              We offer a wide range of treatments to keep your
              smile healthy and beautiful.
            </p>
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
                lg:grid-cols-12
                lg:gap-10
                lg:px-8
                lg:py-12
              "
            >

              {/* =================================================
                  NUMBER
              ================================================== */}
              <div className="lg:col-span-2">
                <span
                  className="
                    text-2xl
                    font-medium
                    tracking-tight
                    text-brand
                  "
                >
                  {service.number}
                </span>
              </div>

              {/* =================================================
                  CONTENT
              ================================================== */}
              <div className="flex flex-col lg:col-span-6">

                <h3
                  className="
                    font-heading
                    text-2xl
                    font-medium
                    tracking-tight
                    text-zinc-950
                    sm:text-3xl
                  "
                >
                  {service.title}
                </h3>

                <p
                  className="
                    mt-4
                    max-w-xl
                    text-base
                    leading-relaxed
                    text-zinc-800
                    sm:text-lg
                  "
                >
                  {service.description}
                </p>

                {/* CTA */}
                <Link
                  href="/contact"
                  className="
                    group
                    mt-auto
                    inline-flex
                    w-fit
                    items-center
                    gap-5
                    pt-12
                    text-base
                    font-semibold
                    text-brand
                  "
                >
                  <span>
                    Contact To Know More
                  </span>

                  <span
                    className="
                      text-2xl
                      transition-transform
                      duration-200
                      group-hover:translate-x-1
                    "
                  >
                    →
                  </span>
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
                  lg:col-span-4
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
                      rounded-2xl
                      sm:rounded-3xl
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
                      sizes="
                        (max-width: 640px) 45vw,
                        (max-width: 1024px) 40vw,
                        220px
                      "
                    />
                  </div>
                ))}
              </div>

            </div>
          </article>
        ))}

      </div>
    </section>
  );
}
