import { Container } from "@/components/website/common/Section";
import SectionLabel from "@/components/website/common/SectionLabel";
import SectionTitle, { Highlight } from "@/components/website/common/SectionTitle";
import ServiceList from "../_components/ServiceList";
import AppointmentCTA from "../_components/AppointmentCTA";

// Services page: a white rounded panel on a gray page, centered header,
// boxed service rows, then the "Get Started" banner.
export default function ServicesPage() {
  return (
    <main className="bg-zinc-100 pt-20">

      <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="rounded-3xl bg-white py-12 sm:py-16 lg:rounded-4xl lg:py-20">

          <Container className="text-center">
            <SectionLabel>OUR DENTAL SERVICES</SectionLabel>

            <SectionTitle as="h1">
              We Provide A Wide Range
              <br />
              Of <Highlight>Dental Services</Highlight>
            </SectionTitle>
          </Container>

          <Container className="mt-12 lg:mt-14">
            <ServiceList boxed />
          </Container>

        </div>
      </div>

      <AppointmentCTA />

    </main>
  );
}
