import Image from "next/image";
import Link from "next/link";
import Button from "@/components/website/ui/Button";

const STATS = [
  {
    label: "Years of Experience",
    value: "10+",
    description: "Clinical excellence.",
  },
  {
    label: "Satisfaction",
    value: "99%",
    description: "Recommended by patients.",
  },
  {
    label: "Specialists",
    value: "15",
    description: "Across all dental fields.",
  },
];

export default function OurStorySection() {
  return (
    <section className="w-full bg-white text-zinc-950">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">

        {/* =====================================================
            INTRO
        ====================================================== */}
        <div>

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
                font-mono
              "
            >
              OUR STORY
            </span>
          </div>

          {/* Heading */}
          <h2
            className="
              font-heading
              text-3xl
              font-normal
              leading-[1.15]
              tracking-tight
              sm:text-4xl
              lg:text-[42px]
            "
          >
            <span className="text-zinc-950">
              Built Around One Simple Belief :{" "}
            </span>

            <span className="text-brand">
              Every Smile Matters
            </span>
          </h2>

          {/* Description */}
          <p
            className="
              mt-5
              max-w-7xl
              text-base
              leading-relaxed
              text-zinc-800
              sm:text-lg
              lg:text-[20px]
            "
          >
            Ilaj Dental Care Was Created With A Simple Goal: To Make
            Professional Dental Care Feel More Comfortable, Accessible, And
            Reassuring. From Routine Checkups To Advanced Treatments, We Focus
            On Understanding Each Patient’s Needs And Creating A Treatment
            Experience That Feels Clear And Stress-Free. We Combine Clinical
            Expertise, Modern Technology, And Genuine Attention To Detail To
            Help Our Patients Maintain Healthier Smiles And Greater Confidence.
          </p>
        </div>

        {/* =====================================================
            MISSION / IMAGE / VISION
        ====================================================== */}
        <div
          className="
            mt-14
            grid
            grid-cols-1
            gap-4
            md:grid-cols-3
            lg:mt-16
          "
        >

          {/* Mission */}
          <div
            className="
              flex
              min-h-[500px]
              flex-col
              rounded-3xl
              border
              border-zinc-200
              bg-zinc-50
              p-8
              sm:p-10
            "
          >

            {/* Icon */}
            <div className="text-5xl text-zinc-950">
              ❖
            </div>

            {/* Content */}
            <div className="mt-auto">

              <h3
                className="
                  text-2xl
                  font-medium
                  tracking-tight
                  text-brand
                "
              >
                Mission
              </h3>

              <p
                className="
                  mt-4
                  text-base
                  leading-relaxed
                  text-zinc-800
                  sm:text-lg
                "
              >
                Our mission is to deliver high-quality dental care in an
                environment where patients feel heard, respected, and
                comfortable. We strive to make modern dentistry accessible
                while maintaining the highest standards of care, safety, and
                professionalism.
              </p>

            </div>
          </div>

          {/* Center Image */}
          <div
            className="
              relative
              min-h-[500px]
              overflow-hidden
              rounded-3xl
            "
          >
            <Image
              src="/images/story/our-story.jpg"
              alt="Dentist providing dental treatment"
              fill
              priority
              className="object-cover"
              sizes="
                (max-width: 768px) 100vw,
                33vw
              "
            />
          </div>

          {/* Vision */}
          <div
            className="
              flex
              min-h-[500px]
              flex-col
              rounded-3xl
              border
              border-zinc-200
              bg-zinc-50
              p-8
              sm:p-10
            "
          >

            {/* Icon */}
            <div className="text-5xl text-zinc-950">
              ◎
            </div>

            {/* Content */}
            <div className="mt-auto">

              <h3
                className="
                  text-2xl
                  font-medium
                  tracking-tight
                  text-brand
                "
              >
                Vision
              </h3>

              <p
                className="
                  mt-4
                  text-base
                  leading-relaxed
                  text-zinc-800
                  sm:text-lg
                "
              >
                Our vision is to redefine dental care by fostering a
                community where every patient feels valued and empowered. We
                aim to innovate dental practices, ensuring that our services
                are not only effective but also compassionate, making every
                visit a step towards a healthier smile.
              </p>

            </div>
          </div>

        </div>

        {/* =====================================================
            STATS + CTA
        ====================================================== */}
        <div
          className="
            mt-14
            grid
            grid-cols-1
            gap-10
            lg:mt-16
            lg:grid-cols-10
            lg:items-end
          "
        >

          {/* Stats */}
          <div
            className="
              grid
              grid-cols-1
              gap-8
              sm:grid-cols-3
              lg:col-span-7
              lg:gap-4
            "
          >
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="
                  lg:px-5
                  first:lg:pl-0
                "
              >

                <h3
                  className="
                    text-base
                    font-semibold
                    text-zinc-950
                    sm:text-lg
                  "
                >
                  {stat.label}
                </h3>

                <div
                  className="
                    mt-4
                    border-t
                    border-zinc-200
                    pt-8
                    font-heading
                    text-5xl
                    font-normal
                    leading-none
                    tracking-tight
                    text-zinc-950
                    sm:text-6xl
                  "
                >
                  {stat.value}
                </div>

                <p
                  className="
                    mt-4
                    text-sm
                    text-zinc-700
                    sm:text-base
                  "
                >
                  {stat.description}
                </p>

              </div>
            ))}
          </div>

          {/* CTA */}
          <div
            className="
              flex
              justify-start
              lg:col-span-3
              lg:justify-end
            "
          >
            <Link href="/services">
              <Button variant="primary">
                Check Our Services
              </Button>
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
