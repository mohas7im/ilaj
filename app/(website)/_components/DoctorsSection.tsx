import Section from "@/components/website/common/Section";
import SectionLabel from "@/components/website/common/SectionLabel";
import SectionTitle, { Highlight } from "@/components/website/common/SectionTitle";
import DoctorsCarousel, { type Doctor } from "./DoctorsCarousel";

const DOCTORS: Doctor[] = [
  {
    name: "Dr. Arya",
    qualification: "BDS, MDS (ORTHODONTICS)",
    image: "/images/doctors/dr-arya.jpg",
  },
  {
    name: "Dr. Meera Thomas",
    qualification: "BDS, MDS (ENDODONTICS)",
    image: "/images/doctors/dr-meera-thomas.jpg",
  },
  {
    name: "Dr. Aisha Rahman",
    qualification: "BDS, MDS (PROSTHODONTICS)",
    image: "/images/doctors/dr-aisha-rahman.jpg",
  },
  {
    name: "Dr. Sona Menon",
    qualification: "BDS, PG DIPLOMA IN IMPLANTOLOGY",
    image: "/images/doctors/dr-sona-menon.jpg",
  },
  // PLACEHOLDER doctors (reusing existing photos) so the carousel has more to show
  {
    name: "Dr. Rahul Nair",
    qualification: "BDS, MDS (ORAL SURGERY)",
    image: "/images/doctors/dr-arya.jpg",
  },
  {
    name: "Dr. Fathima Ali",
    qualification: "BDS, MDS (PEDIATRIC DENTISTRY)",
    image: "/images/doctors/dr-meera-thomas.jpg",
  },
  {
    name: "Dr. Anand Kumar",
    qualification: "BDS, MDS (PERIODONTICS)",
    image: "/images/doctors/dr-aisha-rahman.jpg",
  },
  {
    name: "Dr. Neha Joseph",
    qualification: "BDS, MDS (COSMETIC DENTISTRY)",
    image: "/images/doctors/dr-sona-menon.jpg",
  },
];

export default function DoctorsSection() {
  return (
    <Section>

      {/* Label */}
      <SectionLabel>MEET OUR DOCTORS</SectionLabel>

      {/* Heading, arrows and the draggable card strip */}
      <DoctorsCarousel
        doctors={DOCTORS}
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
