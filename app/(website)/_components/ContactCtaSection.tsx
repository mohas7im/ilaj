import Image from "next/image";
import Link from "next/link";
import Button from "@/components/website/ui/Button";
import SectionTitle from "@/components/website/common/SectionTitle";
import SectionDescription from "@/components/website/common/SectionDescription";

export default function ContactCtaSection() {
  return (
    <section className="relative w-full min-h-156 overflow-hidden">

      {/* Background Image */}
      <Image
        src="/images/contact/contact-cta-bg.webp"
        alt="Patient relaxing during a dental checkup in a modern, comfortable dental clinic at Ilaj Dental Care"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
        quality={100}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Content */}
      <div className="relative z-10 flex min-h-156 items-end px-5 py-10 sm:px-8 sm:py-12 lg:px-16 lg:py-16">

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

            <SectionTitle tone="light">
              Need Dental Care? Get in{" "}
              <br className="hidden sm:block" />
              Touch Today
            </SectionTitle>

            <SectionDescription tone="light" className="mt-5 max-w-xl">
              Have questions or need to book an appointment? Our
              team at Ilaj Dental Care is here to help you with quick
              and friendly support.
            </SectionDescription>

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
