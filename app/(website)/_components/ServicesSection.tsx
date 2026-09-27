import Link from "next/link";
import Section, { Container } from "@/components/website/common/Section";
import SectionLabel from "@/components/website/common/SectionLabel";
import SectionTitle, { Highlight } from "@/components/website/common/SectionTitle";
import SectionDescription from "@/components/website/common/SectionDescription";
import Button from "@/components/website/ui/Button";
import ServiceList from "./ServiceList";

// Home page services: header, full-width service bands, "All Services" button.
export default function ServicesSection() {
  return (
    <Section contained={false}>

      {/* Header */}
      <Container>
        <SectionLabel>OUR DENTAL SERVICES</SectionLabel>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-10 lg:gap-14">
          <div className="lg:col-span-6">
            <SectionTitle>
              We Provide A Wide Range
              <br />
              Of <Highlight>Dental Services</Highlight>
            </SectionTitle>
          </div>

          <div className="flex items-end lg:col-span-4 lg:justify-end">
            <SectionDescription className="max-w-sm">
              We offer a wide range of treatments to keep your
              smile healthy and beautiful.
            </SectionDescription>
          </div>
        </div>
      </Container>

      {/* Services — full-width bands */}
      <div className="mt-12 lg:mt-16">
        <ServiceList />
      </div>

      {/* All Services */}
      <Container className="mt-12 flex justify-center">
        <Link href="/services">
          <Button variant="primary">All Services</Button>
        </Link>
      </Container>

    </Section>
  );
}
