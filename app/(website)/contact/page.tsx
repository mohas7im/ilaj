import Image from "next/image";
import Link from "next/link";

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
              font-mono
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

                <form className="mt-6">

                  <div className="grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-2">

                    {/* Full Name */}
                    <div>
                      <label
                        htmlFor="fullName"
                        className="block text-base font-medium"
                      >
                        Full Name*
                      </label>

                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        placeholder="Enter Your Full Name"
                        required
                        className="
                          mt-3
                          h-12
                          w-full
                          border-0
                          border-b
                          border-zinc-300
                          bg-transparent
                          px-0
                          text-base
                          outline-none
                          placeholder:text-zinc-500
                          focus:border-brand
                        "
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-base font-medium"
                      >
                        Phone Number*
                      </label>

                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        required
                        className="
                          mt-3
                          h-12
                          w-full
                          border-0
                          border-b
                          border-zinc-300
                          bg-transparent
                          px-0
                          text-base
                          outline-none
                          placeholder:text-zinc-500
                          focus:border-brand
                        "
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-base font-medium"
                      >
                        Email Address*
                      </label>

                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email address"
                        required
                        className="
                          mt-3
                          h-12
                          w-full
                          border-0
                          border-b
                          border-zinc-300
                          bg-transparent
                          px-0
                          text-base
                          outline-none
                          placeholder:text-zinc-500
                          focus:border-brand
                        "
                      />
                    </div>

                    {/* Treatment */}
                    <div>
                      <label
                        htmlFor="treatment"
                        className="block text-base font-medium"
                      >
                        Select Treatment*
                      </label>

                      <select
                        id="treatment"
                        name="treatment"
                        required
                        defaultValue=""
                        className="
                          mt-3
                          h-12
                          w-full
                          border-0
                          border-b
                          border-zinc-300
                          bg-transparent
                          px-0
                          text-base
                          text-zinc-500
                          outline-none
                          focus:border-brand
                        "
                      >
                        <option value="" disabled>
                          Choose a treatment
                        </option>

                        <option value="cleaning">
                          Teeth Cleaning
                        </option>

                        <option value="whitening">
                          Teeth Whitening
                        </option>

                        <option value="implants">
                          Dental Implants
                        </option>

                        <option value="orthodontics">
                          Orthodontics
                        </option>

                        <option value="root-canal">
                          Root Canal Treatment
                        </option>

                        <option value="other">
                          Other
                        </option>
                      </select>
                    </div>

                    {/* Preferred Date */}
                    <div>
                      <label
                        htmlFor="date"
                        className="block text-base font-medium"
                      >
                        Preferred Date*
                      </label>

                      <input
                        id="date"
                        name="date"
                        type="date"
                        required
                        className="
                          mt-3
                          h-12
                          w-full
                          border-0
                          border-b
                          border-zinc-300
                          bg-transparent
                          px-0
                          text-base
                          text-zinc-500
                          outline-none
                          focus:border-brand
                        "
                      />
                    </div>

                    {/* Preferred Time */}
                    <div>
                      <label
                        htmlFor="time"
                        className="block text-base font-medium"
                      >
                        Preferred Time*
                      </label>

                      <input
                        id="time"
                        name="time"
                        type="time"
                        required
                        className="
                          mt-3
                          h-12
                          w-full
                          border-0
                          border-b
                          border-zinc-300
                          bg-transparent
                          px-0
                          text-base
                          text-zinc-500
                          outline-none
                          focus:border-brand
                        "
                      />
                    </div>

                    {/* Message */}
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="message"
                        className="block text-base font-medium"
                      >
                        Message*
                      </label>

                      <textarea
                        id="message"
                        name="message"
                        rows={3}
                        placeholder="Enter your message"
                        required
                        className="
                          mt-3
                          w-full
                          resize-none
                          border-0
                          border-b
                          border-zinc-300
                          bg-transparent
                          px-0
                          py-2
                          text-base
                          outline-none
                          placeholder:text-zinc-500
                          focus:border-brand
                        "
                      />
                    </div>

                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="
                      mt-8
                      h-14
                      w-full
                      rounded-full
                      bg-brand
                      px-6
                      text-base
                      font-semibold
                      text-white
                      transition
                      hover:opacity-90
                    "
                  >
                    Book Appointment
                  </button>

                </form>

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
