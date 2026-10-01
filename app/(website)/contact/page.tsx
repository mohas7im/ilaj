import Image from "next/image";
import ContactForm from "./_components/ContactForm";
import AppointmentCTA from "../_components/AppointmentCTA";
import SectionLabel from "@/components/website/common/SectionLabel";
import SectionTitle, { Highlight } from "@/components/website/common/SectionTitle";
import SectionDescription from "@/components/website/common/SectionDescription";
import CardTitle from "@/components/website/common/CardTitle";
import CardText from "@/components/website/common/CardText";
import { getOpeningHours, getSettings, toTelLink } from "@/lib/data/settings";
import { generatePageMetadata } from "@/lib/seo";

// Contact details come from admin settings; refresh at most every 5 minutes.
export const revalidate = 300;

// Title, description and share image come from admin → SEO.
export async function generateMetadata() {
  return generatePageMetadata("contact");
}

type ContactLine = { text: string; href?: string };

export default async function ContactPage() {
  const [settings, openingHours] = await Promise.all([getSettings(), getOpeningHours()]);

  const contactInfo: { title: string; lines: ContactLine[] }[] = [
    {
      title: "Email",
      lines: [settings.primaryEmail, settings.secondaryEmail]
        .filter(Boolean)
        .map((email) => ({ text: email, href: `mailto:${email}` })),
    },
    {
      title: "Phone",
      lines: [settings.phone1, settings.phone2]
        .filter(Boolean)
        .map((phone) => ({ text: phone, href: toTelLink(phone) })),
    },
    {
      title: "Location",
      lines: settings.address.split("\n").filter((line) => line.trim()).map((text) => ({ text })),
    },
    {
      title: "Opening Hours",
      lines: openingHours.map((text) => ({ text })),
    },
  ].filter((item) => item.lines.length > 0);

  // Admin pastes the Google Maps "Embed a map" src. Anything else (empty, a share
  // link, or a non-Google URL we must not iframe) hides the map.
  const mapSrc = settings.mapLink.startsWith("https://www.google.com/maps/embed") ? settings.mapLink : "";

  return (
    <main className="w-full bg-white pt-20 text-zinc-950">

      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="px-5 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20">
        <div className="mx-auto max-w-7xl text-center">

          <SectionLabel>GET IN TOUCH</SectionLabel>

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
      <section className="relative mt-11 pb-12 sm:pb-16 lg:pb-20">

        {/* Decorative photo — pinned to the left edge, faded by the panel over it */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-36 hidden aspect-square w-1/2 lg:block"
        >
          <Image
            src="/images/contact/contact-panel-bg.png"
            alt=""
            fill
            className="object-cover saturate-50"
            sizes="50vw"
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-neutral-100/85 p-5 sm:p-8">

            <div className="grid grid-cols-1 gap-7 lg:grid-cols-8">

              {/* Contact Information */}
              <div className="space-y-6 lg:col-span-3">
                {contactInfo.map((item) => (
                  <div key={item.title}>
                    <CardTitle as="h2" size="sm">
                      {item.title}
                    </CardTitle>

                    <CardText className="mt-1">
                      {item.lines.map((line, i) => (
                        <span key={i}>
                          {i > 0 && <br />}
                          {line.href ? (
                            <a href={line.href} className="hover:text-brand">
                              {line.text}
                            </a>
                          ) : (
                            line.text
                          )}
                        </span>
                      ))}
                    </CardText>
                  </div>
                ))}
              </div>

              {/* Appointment Form */}
              <div
                id="book-appointment"
                className="scroll-mt-28 rounded-2xl lg:col-span-5 border border-zinc-200 bg-white p-3.5"
              >
                <CardTitle as="h2">Book Your Appointment</CardTitle>

                <ContactForm />
              </div>

            </div>

            {/* Google Map */}
            {mapSrc && (
              <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-200">
                <iframe
                  title="Clinic location map"
                  src={mapSrc}
                  className="h-80 w-full border-0 sm:h-96 lg:h-104"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}

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
