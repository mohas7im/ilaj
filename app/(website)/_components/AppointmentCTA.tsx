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
        src="/images/dental-hero.webp"
        alt="Professional dental treatment at Ilaj Dental Clinic"
        fill
        className="object-cover object-center"
        sizes="100vw"
        priority
        quality={100}
      />
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative mx-auto flex min-h-96 max-w-7xl flex-col items-center justify-center px-5 py-16 text-center sm:px-6 sm:py-20 lg:min-h-100 lg:px-8">

        <SectionLabel tone="light">GET STARTED</SectionLabel>

        <SectionTitle tone="light" className="max-w-md">
          Ready for a Beautiful, Confident Smile?
        </SectionTitle>

        {/* mt-4 matches the label's mb-4, so the heading has equal space above and below */}
        <Link href="/contact#book-appointment" className="mt-4">
          <Button variant="primary">Book a Consultation</Button>
        </Link>

      </div>
    </section>
  );
}
