import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import MetaText from "@/components/website/common/MetaText";
import CardText from "@/components/website/common/CardText";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Treatments", href: "/treatments" },
  { label: "Gallery", href: "/gallery" },
  { label: "Smile Gallery", href: "/smile-gallery" },
  { label: "Contact", href: "/contact" },
];

// Brand icons (lucide-react no longer ships them); 24×24 stroke paths
const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: "#",
    icon: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
      </>
    ),
  },
  {
    label: "Facebook",
    href: "#",
    icon: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </>
    ),
  },
  {
    label: "Twitter",
    href: "#",
    icon: <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />,
  },
];

const linkClass = "text-white/80 transition-colors duration-200 hover:text-white";

/**
 * Site footer: brand + three columns (Visit, Explore, Follow) and a bottom bar.
 * It tucks under the page's bottom edge (PageTransition.tsx) and its
 * content rises out from behind it as it scrolls in (.footer-rise, theme.css).
 */
export default function Footer() {
  return (
    <footer className="footer-parallax relative z-0 -mt-10 w-full bg-neutral-900 pt-10 text-white lg:-mt-12 lg:pt-12">
      <div className="footer-rise mx-auto max-w-7xl px-5 pb-8 pt-14 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20">

        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-3" aria-label="Ilaj — Home">
              <span className="flex size-10 items-center justify-center rounded-lg bg-brand text-lg font-bold leading-none text-white">
                C
              </span>
              <span className="text-2xl font-bold tracking-tight">Ilaj</span>
            </Link>

            <CardText tone="light" className="mt-6 max-w-sm">
              Exceptional dental care with experienced professionals, modern
              technology and a commitment to your comfort.
            </CardText>
          </div>

          {/* Visit */}
          <div className="lg:col-span-3">
            <h3><MetaText as="span" tone="light">VISIT US</MetaText></h3>
            <address className="mt-5 space-y-4 not-italic">
              <CardText tone="light">
                Edarikode-Panthakkal Kund Rd,
                <br />
                Kottakkal, Kerala, India
              </CardText>
              <CardText tone="light">
                Mon – Sat: 9:00 AM – 8:00 PM
                <br />
                Sunday: Closed
              </CardText>
              <div className="space-y-1">
                <a href="tel:+919048581112" className={`block ${linkClass}`}>+91 90485 81112</a>
                <a href="mailto:hello@ilajdentalcare.com" className={`block ${linkClass}`}>hello@ilajdentalcare.com</a>
              </div>
            </address>
          </div>

          {/* Explore */}
          <div className="lg:col-span-2">
            <h3><MetaText as="span" tone="light">EXPLORE</MetaText></h3>
            <ul className="mt-5 space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className={`group inline-flex items-center gap-1.5 ${linkClass}`}>
                    {link.label}
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-4 -translate-x-1 text-brand opacity-0 transition-[opacity,translate] duration-200 group-hover:translate-x-0 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Follow */}
          <div className="lg:col-span-3">
            <h3><MetaText as="span" tone="light">FOLLOW US</MetaText></h3>
            <ul className="mt-5 flex gap-3">
              {SOCIAL_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className="flex size-11 items-center justify-center rounded-full border border-white/20 text-white transition-colors duration-200 hover:border-brand hover:bg-brand"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      className="size-4.5"
                    >
                      {link.icon}
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col gap-4 border-t border-white/15 pt-6 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Ilaj Dental Care. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="transition-colors hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="transition-colors hover:text-white">Terms &amp; Conditions</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
