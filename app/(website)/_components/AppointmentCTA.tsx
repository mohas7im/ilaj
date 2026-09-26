import Image from "next/image";
import Link from "next/link";
import Button from "@/components/website/ui/Button";
import SectionLabel from "@/components/website/common/SectionLabel";
import SectionTitle from "@/components/website/common/SectionTitle";

// Full-width "Get Started" banner shown near the bottom of inner pages.
export default function AppointmentCTA() {
  return (
    <section className="relative w-full overflow-hidden bg-neutral-950">

      {/* Background Image */}
      <Image
        src="/images/contact-dental.jpg"
        alt=""
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-5 py-20 text-center sm:px-6 lg:px-8 lg:py-26">

        <SectionLabel tone="light">GET STARTED</SectionLabel>

        <SectionTitle tone="light" className="max-w-[460px]">
          Ready to take a Beautiful Smile with us!
        </SectionTitle>

        <Link href="/contact#book-appointment" className="mt-3">
          <Button variant="primary">Book a Consultation</Button>
        </Link>

      </div>
    </section>
  );
}
