import Image from "next/image";
import ContactForm from "./_components/ContactForm";
import AppointmentCTA from "../_components/AppointmentCTA";
import SectionLabel from "@/components/website/common/SectionLabel";
import SectionTitle, { Highlight } from "@/components/website/common/SectionTitle";
import SectionDescription from "@/components/website/common/SectionDescription";
import CardTitle from "@/components/website/common/CardTitle";
import CardText from "@/components/website/common/CardText";

const CONTACT_INFO = [
  {
    title: "Email",
    lines: ["contact@ilajdentalcare.com"],
    href: "mailto:contact@ilajdentalcare.com",
  },
  {
    title: "Phone",
    lines: ["+91 97265 37777"],
    href: "tel:+919726537777",
  },
  {
    title: "Location",
    lines: ["Ilaj Dental Care", "Edarikode-Panthakkal Kund Rd,", "Kottakkal, Kerala", "India"],
  },
  {
    title: "Opening Hours",
    lines: ["Mon – Sat: 9:00 AM – 8:00 PM", "Sunday: Closed"],
  },
];

export default function ContactPage() {
  return (
    <main className="w-full bg-white pt-20 text-zinc-950">

      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="px-5 pt-12 sm:px-6 lg:px-8 lg:pt-[76px]">
        <div className="mx-auto max-w-7xl text-center">

          <SectionLabel>OUR DENTAL SERVICES</SectionLabel>

          <SectionTitle as="h1" className="mx-auto max-w-3xl">
            We’re Here To <Highlight>Help You</Highlight>
            <br />
            <Highlight>Smile Brighter</Highlight>
          </SectionTitle>

          <SectionDescription className="mx-auto mt-2.5 max-w-3xl">
            Got questions about your dental health or need a little
            guidance? Reach out to us, and our friendly team will help
            you find the right care for a healthier, more confident smile.
          </SectionDescription>

        </div>
      </section>

      {/* =====================================================
          CONTACT + FORM + MAP
      ====================================================== */}
      <section className="relative mt-11 pb-16 sm:pb-20 lg:pb-24">

        {/* Decorative photo — pinned to the left edge, faded by the panel over it */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-[145px] hidden aspect-square w-[781px] lg:block"
        >
          <Image
            src="/images/contact/contact-panel-bg.png"
            alt=""
            fill
            className="object-cover saturate-50"
            sizes="781px"
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-neutral-100/85 p-5 sm:p-7.5">

            <div className="grid grid-cols-1 gap-7 lg:grid-cols-[minmax(0,3fr)_minmax(0,5fr)]">

              {/* Contact Information */}
              <div className="space-y-6.5">
                {CONTACT_INFO.map((item) => (
                  <div key={item.title}>
                    <CardTitle as="h2" size="sm">
                      {item.title}
                    </CardTitle>

                    <CardText className="mt-1">
                      {item.href ? (
                        <a href={item.href} className="hover:text-brand">
                          {item.lines[0]}
                        </a>
                      ) : (
                        item.lines.map((line, i) => (
                          <span key={line}>
                            {i > 0 && <br />}
                            {line}
                          </span>
                        ))
                      )}
                    </CardText>
                  </div>
                ))}
              </div>

              {/* Appointment Form */}
              <div
                id="book-appointment"
                className="scroll-mt-28 rounded-2xl border border-zinc-200 bg-white p-3.5"
              >
                <CardTitle as="h2">Book Your Appointment</CardTitle>

                <ContactForm />
              </div>

            </div>

            {/* Google Map */}
            <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-200">
              <iframe
                title="Ilaj Dental Care Location"
                src="https://www.google.com/maps?q=Ilaj%20Dental%20Care%20Kottakkal%20Kerala&output=embed"
                className="h-[320px] w-full border-0 sm:h-[380px] lg:h-[420px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          GET STARTED
      ====================================================== */}
      <AppointmentCTA />

    </main>
  );
}
