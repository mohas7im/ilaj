import Image from "next/image";
import Link from "next/link";
import Button from "@/components/website/ui/Button";

export default function AboutIntroSection() {
  return (
    <section className="w-full bg-white text-zinc-950">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">

          {/* =====================================================
              LEFT CONTENT
          ====================================================== */}
          <div className="flex flex-col lg:col-span-6">

            {/* Label */}
            <div>
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
                  font-mono
                "
              >
                ABOUT ILAJ DENTAL CARE
              </span>
            </div>

            {/* Heading */}
            <h2
              className="
                mt-6
                max-w-3xl
                font-heading
                text-4xl
                font-normal
                leading-[1.08]
                tracking-tight
                sm:text-5xl
                lg:text-[54px]
              "
            >
              <span className="text-zinc-950">
                Where{" "}
              </span>

              <span className="text-brand">
                Better Dentistry
              </span>

              <br />

              <span className="text-zinc-950">
                Begins With Better Care
              </span>
            </h2>

            {/* Description */}
            <p
              className="
                mt-6
                max-w-2xl
                text-base
                leading-relaxed
                text-zinc-800
                sm:text-lg
                lg:text-[19px]
              "
            >
              At Ilaj Dental Care, we believe a great dental experience is
              about more than treating teeth. It’s about understanding people,
              earning trust, and making every visit feel comfortable. With
              modern dentistry and a patient-first approach, we’re here to make
              quality dental care simpler, gentler, and more personal.
            </p>

            {/* CTA */}
            <div className="mt-auto pt-12 lg:pt-20">
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
          <div className="grid grid-cols-2 gap-4 lg:col-span-6">

            {/* Large Image */}
            <div className="relative h-[520px] overflow-hidden rounded-3xl sm:h-[620px] lg:h-[790px]">

              <Image
                src="/images/about/about-main.jpg"
                alt="Dentist providing dental treatment"
                fill
                priority
                className="object-cover"
                sizes="
                  (max-width: 640px) 50vw,
                  (max-width: 1024px) 45vw,
                  25vw
                "
              />

            </div>

            {/* Right Small Images */}
            <div className="grid grid-rows-2 gap-4">

              {/* Top Image */}
              <div className="relative overflow-hidden rounded-3xl">

                <Image
                  src="/images/about/about-small-1.jpg"
                  alt="Dental care model"
                  fill
                  className="object-cover"
                  sizes="
                    (max-width: 640px) 50vw,
                    (max-width: 1024px) 45vw,
                    25vw
                  "
                />

              </div>

              {/* Bottom Image */}
              <div className="relative overflow-hidden rounded-3xl">

                <Image
                  src="/images/about/about-small-2.jpg"
                  alt="Dental hygiene demonstration"
                  fill
                  className="object-cover"
                  sizes="
                    (max-width: 640px) 50vw,
                    (max-width: 1024px) 45vw,
                    25vw
                  "
                />

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
