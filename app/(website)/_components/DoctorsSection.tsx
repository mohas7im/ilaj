import Image from "next/image";
import Section from "@/components/website/common/Section";
import SectionLabel from "@/components/website/common/SectionLabel";
import SectionTitle, { Highlight } from "@/components/website/common/SectionTitle";
import CardTitle from "@/components/website/common/CardTitle";
import MetaText from "@/components/website/common/MetaText";
import ArrowButton from "@/components/website/ui/ArrowButton";

const DOCTORS = [
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
];

export default function DoctorsSection() {
  return (
    <Section>

        {/* =====================================================
            HEADER
        ====================================================== */}
        <div className="relative">

          {/* Label */}
          <SectionLabel>MEET OUR DOCTORS</SectionLabel>

          {/* Heading + Arrows */}
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">

            <SectionTitle className="max-w-3xl">
              Our skilled <Highlight>dental team</Highlight> ensures the{" "}
              <br className="hidden sm:block" />
              best care for your health.
            </SectionTitle>

            {/* Navigation Buttons */}
            <div className="flex shrink-0 gap-2">

              <ArrowButton direction="prev" label="Previous doctors" />

              <ArrowButton direction="next" label="Next doctors" />

            </div>
          </div>
        </div>

        {/* =====================================================
            DOCTOR CARDS
        ====================================================== */}
        <div
          className="
            mt-16
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >
          {DOCTORS.map((doctor, index) => (
            <article
              key={doctor.name}
              style={{ "--i": index } as React.CSSProperties}
              className="
                reveal
                group
                flex
                flex-col
                overflow-hidden
                rounded-2xl
                border
                border-zinc-200
                bg-white
              "
            >

              {/* Card Information — qualification always reserves 2 lines so cards stay even */}
              <div className="p-6">
                <CardTitle>{doctor.name}</CardTitle>
                <MetaText className="mt-2 min-h-8">{doctor.qualification}</MetaText>
              </div>

              {/* Doctor Image */}
              <div className="relative mt-auto aspect-9/10 w-full overflow-hidden">
                <Image
                  src={doctor.image}
                  alt={doctor.name}
                  fill
                  className="object-cover transition-[filter,scale] duration-700 ease-out group-hover:scale-105 [@media(hover:hover)]:grayscale [@media(hover:hover)]:group-hover:grayscale-0"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>

            </article>
          ))}
        </div>

      </Section>
  );
}
