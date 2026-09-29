import Section from "@/components/website/common/Section";
import SectionLabel from "@/components/website/common/SectionLabel";
import SectionTitle, { Highlight } from "@/components/website/common/SectionTitle";
import DoctorsCarousel from "./DoctorsCarousel";
import { getWebsiteDoctors } from "../_lib/doctors";

// Active doctors from admin. Hidden until there is one.
export default async function DoctorsSection() {
  const doctors = await getWebsiteDoctors();
  if (doctors.length === 0) return null;

  return (
    <Section>

      {/* Label */}
      <SectionLabel>MEET OUR DOCTORS</SectionLabel>

      {/* Heading, arrows and the draggable card strip */}
      <DoctorsCarousel
        doctors={doctors}
        heading={
          <SectionTitle className="max-w-3xl">
            Our skilled <Highlight>dental team</Highlight> ensures the{" "}
            <br className="hidden sm:block" />
            best care for your health.
          </SectionTitle>
        }
      />

    </Section>
  );
}
