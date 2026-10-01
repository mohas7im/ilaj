import Link from "next/link";
import Section, { Container } from "@/components/website/common/Section";
import SectionLabel from "@/components/website/common/SectionLabel";
import SectionTitle, { Highlight } from "@/components/website/common/SectionTitle";
import SectionDescription from "@/components/website/common/SectionDescription";
import Button from "@/components/website/ui/Button";
import ServiceList from "./ServiceList";
import { getWebsiteServices } from "../_lib/services";

// Home page services: header, full-width service bands, "All Treatments" button.
export default async function ServicesSection() {
  const services = (await getWebsiteServices()).filter((service) => service.showInHomePage);

  return (
    <Section contained={false}>

      {/* Header */}
      <Container>
        <SectionLabel>OUR DENTAL TREATMENTS</SectionLabel>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-10 lg:gap-14">
          <div className="lg:col-span-6">
            <SectionTitle>
              Treatments Designed
              <br />
              Around <Highlight>Your Smile</Highlight>
            </SectionTitle>
          </div>

          <div className="flex items-end lg:col-span-4 lg:justify-end">
            <SectionDescription className="max-w-sm">
              From preventive care to advanced procedures, explore the
              treatments we offer to help you smile with confidence.
            </SectionDescription>
          </div>
        </div>
      </Container>

      {/* Services — full-width bands */}
      <div className="mt-12 lg:mt-16">
        <ServiceList services={services} />
      </div>

      {/* All Treatments */}
      <Container className="mt-12 flex justify-center">
        <Link href="/treatments">
          <Button variant="primary">All Treatments</Button>
        </Link>
      </Container>

    </Section>
  );
}
