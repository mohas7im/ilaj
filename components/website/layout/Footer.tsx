import Link from "next/link";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

const SERVICES = [
  { label: "Teeth Cleaning", href: "/services/teeth-cleaning" },
  { label: "Teeth Whitening", href: "/services/teeth-whitening" },
  { label: "Braces & Aligners", href: "/services/braces-aligners" },
  { label: "Dental Implants", href: "/services/dental-implants" },
  { label: "Root Canal Treatment", href: "/services/root-canal" },
];

const SOCIAL_LINKS = [
  { label: "Instagram", href: "#" },
  { label: "Facebook", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "Twitter", href: "#" },
];

const UTILITY_LINKS = [
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
];

export default function Footer() {
  return (
    <footer className="w-full bg-[#151515] text-white">

      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">

        {/* =====================================================
            MAIN FOOTER
        ====================================================== */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">

          {/* =================================================
              BRAND + CONTACT INFORMATION
          ================================================== */}
          <div className="lg:col-span-7">

            {/* Logo */}
            <Link
              href="/"
              className="inline-flex items-center gap-3"
            >
              <span
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-md
                  bg-brand
                  text-xl
                  font-bold
                  text-white
                "
              >
                C
              </span>

              <span
                className="
                  text-3xl
                  font-semibold
                  tracking-tight
                "
              >
                Ilaj
              </span>
            </Link>

            {/* Description */}
            <p
              className="
                mt-7
                max-w-xl
                text-base
                leading-relaxed
                text-white/90
                sm:text-lg
              "
            >
              Providing exceptional dental care with experienced
              professionals, advanced technology, and a commitment
              to your comfort and well-being.
            </p>

            {/* Contact Details */}
            <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2">

              {/* Address */}
              <div>
                <h3
                  className="
                    text-sm
                    font-semibold
                    uppercase
                    tracking-wider
                    text-white
                  "
                >
                  Address
                </h3>

                <address
                  className="
                    mt-4
                    not-italic
                    text-base
                    leading-relaxed
                    text-white/85
                  "
                >
                  Ilaj Dental Care
                  <br />
                  Edarikode-Panthakkal Kund Rd
                  <br />
                  Kottakkal, Kerala
                  <br />
                  India
                </address>
              </div>

              {/* Opening Hours */}
              <div>
                <h3
                  className="
                    text-sm
                    font-semibold
                    uppercase
                    tracking-wider
                    text-white
                  "
                >
                  Opening Hours
                </h3>

                <p
                  className="
                    mt-4
                    text-base
                    leading-relaxed
                    text-white/85
                  "
                >
                  Mon – Sat: 9:00 AM – 8:00 PM
                  <br />
                  Sunday: Closed
                </p>
              </div>

              {/* Phone */}
              <div>
                <h3
                  className="
                    text-sm
                    font-semibold
                    uppercase
                    tracking-wider
                    text-white
                  "
                >
                  Phone
                </h3>

                <a
                  href="tel:+919048581112"
                  className="
                    mt-4
                    block
                    text-base
                    text-white/85
                    transition
                    hover:text-brand
                  "
                >
                  +91 90485 81112
                </a>
              </div>

              {/* Email */}
              <div>
                <h3
                  className="
                    text-sm
                    font-semibold
                    uppercase
                    tracking-wider
                    text-white
                  "
                >
                  Email
                </h3>

                <a
                  href="mailto:hello@ilajdentalcare.com"
                  className="
                    mt-4
                    block
                    text-base
                    text-white/85
                    transition
                    hover:text-brand
                  "
                >
                  hello@ilajdentalcare.com
                </a>
              </div>

            </div>
          </div>

          {/* =================================================
              RIGHT LINKS
          ================================================== */}
          <div
            className="
              border-t
              border-white/30
              pt-10
              lg:col-span-5
              lg:border-l
              lg:border-t-0
              lg:pl-16
              lg:pt-8
            "
          >

            <div className="grid grid-cols-2 gap-x-8 gap-y-12">

              {/* Quick Links */}
              <div>
                <h3
                  className="
                    text-sm
                    font-semibold
                    uppercase
                    tracking-wider
                  "
                >
                  Quick Links
                </h3>

                <ul className="mt-6 space-y-3">
                  {QUICK_LINKS.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="
                          text-base
                          text-white/90
                          transition
                          hover:text-brand
                        "
                      >
                        •&nbsp; {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Services */}
              <div>
                <h3
                  className="
                    text-sm
                    font-semibold
                    uppercase
                    tracking-wider
                  "
                >
                  Our Services
                </h3>

                <ul className="mt-6 space-y-3">
                  {SERVICES.map((service) => (
                    <li key={service.label}>
                      <Link
                        href={service.href}
                        className="
                          text-base
                          text-white/90
                          transition
                          hover:text-brand
                        "
                      >
                        •&nbsp; {service.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Social Media */}
              <div>
                <h3
                  className="
                    text-sm
                    font-semibold
                    uppercase
                    tracking-wider
                  "
                >
                  Social Media
                </h3>

                <ul className="mt-6 space-y-3">
                  {SOCIAL_LINKS.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                          text-base
                          text-white/90
                          transition
                          hover:text-brand
                        "
                      >
                        •&nbsp; {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Utility */}
              <div>
                <h3
                  className="
                    text-sm
                    font-semibold
                    uppercase
                    tracking-wider
                  "
                >
                  Utility
                </h3>

                <ul className="mt-6 space-y-3">
                  {UTILITY_LINKS.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="
                          text-base
                          text-white/90
                          transition
                          hover:text-brand
                        "
                      >
                        •&nbsp; {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>

        </div>

        {/* =====================================================
            BOTTOM DIVIDER
        ====================================================== */}
        <div className="mt-12 border-t border-white/30 pt-6">

          <div
            className="
              flex
              flex-col
              gap-5
              text-sm
              text-white/90
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >

            {/* Copyright */}
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/privacy"
                className="hover:text-brand"
              >
                Privacy Policy
              </Link>

              <span className="text-white/50">|</span>

              <Link
                href="/terms"
                className="hover:text-brand"
              >
                Terms and Conditions
              </Link>

              <span className="text-white/50">|</span>

              <span>
                © {new Date().getFullYear()} Ilaj Dental Care.
                All rights reserved.
              </span>
            </div>

            {/* Credit */}
            <div>
              Made By{" "}
              <span className="text-white/70">
                UI/UX Designer
              </span>
            </div>

          </div>
        </div>

      </div>
    </footer>
  );
}
