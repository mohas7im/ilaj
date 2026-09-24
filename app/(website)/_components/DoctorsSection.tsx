import Image from "next/image";
import Link from "next/link";

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
          <div className="mb-6">
            <span
              className="
                inline-flex
                rounded-full
                border border-zinc-200
                px-4 py-2
                text-xs
                font-semibold
                uppercase
                tracking-wider
                text-zinc-800
                font-heading
              "
            >
              MEET OUR DOCTORS
            </span>
          </div>

          {/* Heading + Arrows */}
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">

            <h2
              className="
                max-w-3xl
                font-heading
                text-4xl
                font-normal
                leading-[1.1]
                tracking-tight
                sm:text-5xl
                lg:text-[46px]
              "
            >
              <span className="text-zinc-950">
                Our skilled{" "}
              </span>

              <span className="text-brand">
                dental team
              </span>

              <span className="text-zinc-950">
                {" "}ensures the
                <br className="hidden sm:block" />
                best care for your health.
              </span>
            </h2>

            {/* Navigation Buttons */}
            <div className="flex shrink-0 gap-3">

              <button
                type="button"
                aria-label="Previous doctors"
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-zinc-200
                  text-2xl
                  text-brand
                  transition
                  hover:bg-zinc-50
                "
              >
                ←
              </button>

              <button
                type="button"
                aria-label="Next doctors"
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-zinc-200
                  text-2xl
                  text-brand
                  transition
                  hover:bg-zinc-50
                "
              >
                →
              </button>

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
                <h3
                  className="
                    text-xl
                    font-semibold
                    tracking-tight
                    text-zinc-950
                    sm:text-2xl
                  "
                >
                  {doctor.name}
                </h3>

                {/* Qualification */}
                <p
                  className="
                    mt-2
                    text-xs
                    font-medium
                    uppercase
                    tracking-wider
                    text-zinc-800
                    font-heading
                  "
                >
                  {doctor.qualification}
                </p>

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
                  sizes="
                    (max-width: 640px) 100vw,
                    (max-width: 1024px) 50vw,
                    25vw
                  "
                />
              </div>

            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
