import Image from "next/image";
import Link from "next/link";
import ContactForm from "./_components/ContactForm";

export default function ContactPage() {
  return (
    <main className="w-full bg-white text-zinc-950">

      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="px-5 pt-10 sm:px-6 sm:pt-14 lg:px-8 lg:pt-16">
        <div className="mx-auto max-w-7xl text-center">

          {/* Label */}
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
            "
          >
            OUR DENTAL SERVICES
          </span>

          {/* Heading */}
          <h1
            className="
              mx-auto
              mt-6
              max-w-3xl
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
              We’re Here To{" "}
            </span>

            <span className="text-brand">
              Help You
            </span>

            <br />

            <span className="text-brand">
              Smile Brighter
            </span>
          </h1>

          {/* Description */}
          <p
            className="
              mx-auto
              mt-5
              max-w-3xl
              text-base
              leading-relaxed
              text-zinc-800
              sm:text-lg
            "
          >
            Got questions about your dental health or need a little
            guidance? Reach out to us, and our friendly team will help
            you find the right care for a healthier, more confident smile.
          </p>

        </div>
      </section>

      {/* =====================================================
          CONTACT AREA
      ====================================================== */}
      <section className="relative mt-14 overflow-hidden sm:mt-16">

        {/* Background Image */}
        <div className="absolute inset-0">

          <Image
            src="/images/contact/contact-bg.jpg"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />

          {/* White overlay */}
          <div className="absolute inset-0 bg-white/85" />

        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-5 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">

          <div
            className="
              overflow-hidden
              rounded-3xl
              bg-zinc-100/95
              p-5
              sm:p-7
              lg:p-8
            "
          >

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">

              {/* =================================================
                  CONTACT INFORMATION
              ================================================== */}
              <div
                className="
                  flex
                  flex-col
                  justify-between
                  px-2
                  py-3
                  sm:px-4
                  lg:col-span-4
                  lg:p-4
                "
              >

                <div className="space-y-9">

                  {/* Email */}
                  <div>
                    <h2 className="text-xl font-semibold">
                      Email
                    </h2>

                    <a
                      href="mailto:contact@ilajdentalcare.com"
                      className="
                        mt-2
                        block
                        text-base
                        text-zinc-800
                        hover:text-brand
                      "
                    >
                      contact@ilajdentalcare.com
                    </a>
                  </div>

                  {/* Phone */}
                  <div>
                    <h2 className="text-xl font-semibold">
                      Phone
                    </h2>

                    <a
                      href="tel:+919726537777"
                      className="
                        mt-2
                        block
                        text-base
                        text-zinc-800
                        hover:text-brand
                      "
                    >
                      +91 97265 37777
                    </a>
                  </div>

                  {/* Location */}
                  <div>
                    <h2 className="text-xl font-semibold">
                      Location
                    </h2>

                    <p
                      className="
                        mt-2
                        max-w-xs
                        text-base
                        leading-relaxed
                        text-zinc-800
                      "
                    >
                      Ilaj Dental Care
                      <br />
                      Edarikode-Panthakkal Kund Rd,
                      <br />
                      Kottakkal, Kerala
                      <br />
                      India
                    </p>
                  </div>

                  {/* Opening Hours */}
                  <div>
                    <h2 className="text-xl font-semibold">
                      Opening Hours
                    </h2>

                    <p
                      className="
                        mt-2
                        text-base
                        leading-relaxed
                        text-zinc-800
                      "
                    >
                      Mon – Sat: 9:00 AM – 8:00 PM
                      <br />
                      Sunday: Closed
                    </p>
                  </div>

                </div>

              </div>

              {/* =================================================
                  APPOINTMENT FORM
              ================================================== */}
              <div
                className="
                  rounded-3xl
                  border
                  border-zinc-200
                  bg-white
                  p-6
                  sm:p-8
                  lg:col-span-8
                  lg:p-8
                "
              >

                <h2
                  className="
                    font-heading
                    text-2xl
                    font-medium
                    tracking-tight
                    sm:text-3xl
                  "
                >
                  Book Your Appointment
                </h2>

                <ContactForm />

              </div>

            </div>

            {/* =================================================
                GOOGLE MAP
            ================================================== */}
            <div className="mt-8 overflow-hidden rounded-2xl border border-zinc-200">

              <iframe
                title="Ilaj Dental Care Location"
                src="https://www.google.com/maps?q=Ilaj%20Dental%20Care%20Kottakkal%20Kerala&output=embed"
                className="
                  h-[320px]
                  w-full
                  border-0
                  sm:h-[380px]
                  lg:h-[420px]
                "
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />

            </div>

          </div>

        </div>
      </section>

    </main>
  );
}
