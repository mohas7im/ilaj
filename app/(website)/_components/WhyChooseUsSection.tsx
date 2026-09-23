import Image from "next/image";

const FEATURES = [
  "Experienced & Qualified Doctors",
  "Advanced Equipment",
  "Pain-Free Treatments",
  "Affordable Pricing",
  "Friendly Environment",
];

export default function WhyChooseUsSection() {
  return (
    <section className="w-full bg-white text-zinc-950 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-10 lg:gap-16">

          {/* =================================================
              LEFT CONTENT
          ================================================== */}
          <div className="lg:col-span-6">

            {/* Heading */}
            <div className="max-w-2xl">
              <h2
                className="
                  font-heading
                  text-4xl
                  font-normal
                  leading-[1.1]
                  tracking-tight
                  sm:text-5xl
                  lg:text-[48px]
                "
              >
                <span className="text-zinc-950">
                  What Makes Ilaj
                </span>

                <br />

                <span className="text-brand">
                  Dental Care Different
                </span>
              </h2>

              <p
                className="
                  mt-5
                  max-w-xl
                  text-base
                  leading-relaxed
                  text-zinc-900
                  sm:text-lg
                "
              >
                Experience and compassion — our team delivers
                high-quality care in a patient-first environment.
              </p>
            </div>

            {/* Feature List */}
            <div className="mt-28 sm:mt-32 lg:mt-36">

              <div className="space-y-9 sm:space-y-10">

                {FEATURES.map((feature, index) => (
                  <div
                    key={feature}
                    className="flex items-center gap-5"
                  >

                    {/* Number */}
                    <span
                      className="
                        w-8
                        shrink-0
                        text-xl
                        font-medium
                        tracking-tight
                        text-brand
                      "
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    {/* Feature */}
                    <h3
                      className="
                        text-2xl
                        font-medium
                        leading-tight
                        tracking-tight
                        text-zinc-950
                        sm:text-3xl
                      "
                    >
                      {feature}
                    </h3>

                  </div>
                ))}

              </div>

            </div>
          </div>

          {/* =================================================
              RIGHT IMAGE
          ================================================== */}
          <div className="lg:col-span-4">

            <div
              className="
                relative
                h-[520px]
                w-full
                overflow-hidden
                rounded-3xl
                sm:h-[600px]
                lg:h-[790px]
              "
            >
              <Image
                src="/images/why-ilaj.jpg"
                alt="Patient smiling and looking at their teeth"
                fill
                priority
                className="object-cover"
                sizes="
                  (max-width: 1024px) 100vw,
                  40vw
                "
              />
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
