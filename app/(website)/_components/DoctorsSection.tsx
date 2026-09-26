import Image from "next/image";
import Link from "next/link";
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
    instagram: "#",
    linkedin: "#",
  },
  {
    name: "Dr. Meera Thomas",
    qualification: "BDS, MDS (ENDODONTICS)",
    image: "/images/doctors/dr-meera-thomas.jpg",
    instagram: "#",
    linkedin: "#",
  },
  {
    name: "Dr. Aisha Rahman",
    qualification: "BDS, MDS (PROSTHODONTICS)",
    image: "/images/doctors/dr-aisha-rahman.jpg",
    instagram: "#",
    linkedin: "#",
  },
  {
    name: "Dr. Sona Menon",
    qualification: "BDS, PG DIPLOMA IN IMPLANTOLOGY",
    image: "/images/doctors/dr-sona-menon.jpg",
    instagram: "#",
    linkedin: "#",
  },
];

export default function DoctorsSection() {
  return (
    <section className="w-full bg-white py-14 text-zinc-950 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

        {/* =====================================================
            HEADER
        ====================================================== */}
        <div className="relative">

          {/* Label */}
          <SectionLabel>MEET OUR DOCTORS</SectionLabel>

          {/* Heading + Arrows */}
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">

            <SectionTitle className="max-w-3xl">
              Our skilled <Highlight>dental team</Highlight> ensures the
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
          {DOCTORS.map((doctor) => (
            <article
              key={doctor.name}
              className="
                overflow-hidden
                rounded-2xl
                border
                border-zinc-200
                bg-white
              "
            >

              {/* Card Information */}
              <div className="flex h-[202px] flex-col p-7">

                {/* Doctor Name */}
                <CardTitle>{doctor.name}</CardTitle>

                {/* Qualification */}
                <MetaText className="mt-2">{doctor.qualification}</MetaText>

                {/* Social Links */}
                <div className="mt-auto flex items-center gap-4">

                  <Link
                    href={doctor.instagram}
                    aria-label={`${doctor.name} Instagram`}
                    className="
                      text-xl
                      font-semibold
                      text-zinc-950
                      transition
                      hover:text-brand
                    "
                  >
                    ◎
                  </Link>

                  <Link
                    href={doctor.linkedin}
                    aria-label={`${doctor.name} LinkedIn`}
                    className="
                      text-lg
                      font-bold
                      text-zinc-950
                      transition
                      hover:text-brand
                    "
                  >
                    in
                  </Link>

                </div>
              </div>

              {/* Doctor Image */}
              <div className="relative aspect-[0.9/1] w-full">
                <Image
                  src={doctor.image}
                  alt={doctor.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>

            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
