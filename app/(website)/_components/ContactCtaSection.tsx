import Image from "next/image";
import Link from "next/link";
import Button from "@/components/website/ui/Button";

export default function ContactCtaSection() {
  return (
    <section className="relative w-full min-h-[620px] overflow-hidden">

      {/* Background Image */}
      <Image
        src="/images/contact-dental.jpg"
        alt="Dental care at Ilaj Dental Care"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Content */}
      <div className="relative z-10 flex min-h-[620px] items-end px-5 py-10 sm:px-8 sm:py-12 lg:px-16 lg:py-16">

        <div
          className="
            mx-auto
            flex
            w-full
            max-w-7xl
            flex-col
            gap-8
            rounded-3xl
            border
            border-white/10
            bg-black/45
            p-7
            backdrop-blur-md
            sm:p-10
            lg:flex-row
            lg:items-center
            lg:justify-between
            lg:px-14
            lg:py-12
          "
        >

          {/* Text */}
          <div className="max-w-2xl">

            <h2
              className="
                font-heading
                text-3xl
                font-normal
                leading-tight
                tracking-tight
                text-white
                sm:text-4xl
                lg:text-5xl
              "
            >
              Need Dental Care? Get in
              <br className="hidden sm:block" />
              Touch Today
            </h2>

            <p
              className="
                mt-5
                max-w-xl
                text-base
                leading-relaxed
                text-white/90
                sm:text-lg
              "
            >
              Have questions or need to book an appointment? Our
              team at Ilaj Dental Care is here to help you with quick
              and friendly support.
            </p>

          </div>

          {/* Button */}
          <div className="shrink-0">
            <Link href="/contact">
              <Button variant="primary">
                Contact Us
              </Button>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
