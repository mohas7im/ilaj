import type { Metadata } from "next";
import SectionLabel from "@/components/website/common/SectionLabel";
import SectionTitle, { Highlight } from "@/components/website/common/SectionTitle";
import SectionDescription from "@/components/website/common/SectionDescription";
import CardTitle from "@/components/website/common/CardTitle";
import CardText from "@/components/website/common/CardText";
import AppointmentForm from "./_components/AppointmentForm";
import AppointmentCTA from "../_components/AppointmentCTA";
import { getSettings, toTelLink } from "@/lib/data/settings";

export const metadata: Metadata = {
  title: "Book Appointment",
  description: "Schedule your consultation or dental treatment online with Ilaj Dental Care.",
};

export default async function AppointmentPage() {
  const settings = await getSettings();

  return (
    <main className="w-full bg-white pt-20 text-zinc-950">
      <section className="px-5 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20">
        <div className="mx-auto max-w-7xl text-center">
          <SectionLabel>RESERVATION</SectionLabel>

          <SectionTitle as="h1" className="mx-auto max-w-3xl">
            Book Your <Highlight>Appointment</Highlight> Online
          </SectionTitle>

          <SectionDescription className="mx-auto mt-2.5 max-w-2xl">
            Choose your preferred time and dental service. Our friendly care team will verify your appointment and follow up promptly.
          </SectionDescription>
        </div>
      </section>

      <section className="relative mt-11 pb-16 sm:pb-20 lg:pb-24">
        <div className="relative mx-auto max-w-4xl px-5 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-zinc-200/90 bg-white p-6 shadow-sm sm:p-10">
            <div className="mb-8">
              <CardTitle as="h2">Select Date & Dental Service</CardTitle>
              <CardText className="mt-1">
                Fill in your details below. For urgent assistance, you can also call us directly at{" "}
                {settings.phone1 ? (
                  <a href={toTelLink(settings.phone1)} className="font-medium text-brand hover:underline">
                    {settings.phone1}
                  </a>
                ) : (
                  "our clinic"
                )}
                .
              </CardText>
            </div>

            <AppointmentForm />
          </div>
        </div>
      </section>

      <AppointmentCTA />
    </main>
  );
}
