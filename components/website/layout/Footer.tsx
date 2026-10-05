import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getSettings, toTelLink, toWhatsAppLink } from "@/lib/data/settings";
import MetaText from "@/components/website/common/MetaText";
import BackToTopButton from "./BackToTopButton";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Treatments", href: "/treatments" },
  { label: "Smile Gallery", href: "/smile-gallery" },
  { label: "Contact", href: "/contact" },
];

const LEGAL_LINKS = [
  { label: "Privacy policy", href: "/privacy" },
  { label: "Terms of use", href: "/terms" },
  { label: "Medical disclaimer", href: "/medical-disclaimer" },
];

// Settings store bare handles ("ilajdental"), not full URLs — the admin
// form itself shows this via its https://facebook.com/ style input prefix
// (SettingsForm.tsx), so build the real link here the same way.
// Brand icons (lucide-react no longer ships them); 24×24 stroke paths.
// Only rendered when the matching settings field is filled in admin.
const SOCIAL_LINKS = (settings: Awaited<ReturnType<typeof getSettings>>) =>
  [
    {
      label: "Facebook",
      href: settings.facebook && `https://facebook.com/${settings.facebook}`,
      icon: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
    },
    {
      label: "Instagram",
      href: settings.instagram && `https://instagram.com/${settings.instagram}`,
      icon: (
        <>
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
        </>
      ),
    },
    {
      label: "LinkedIn",
      href: settings.linkedin && `https://linkedin.com/${settings.linkedin}`,
      icon: (
        <>
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </>
      ),
    },
    {
      label: "X (Twitter)",
      href: settings.twitter && `https://x.com/${settings.twitter}`,
      icon: <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />,
    },
  ].filter((link): link is typeof link & { href: string } => Boolean(link.href));

const linkClass = "text-white/80 transition-colors duration-200 hover:text-white";

/**
 * Site footer: a hairline-divided social list, three link columns
 * (Navigation / Contact / Legal), and a bottom bar with the wordmark,
 * copyright and a back-to-top control.
 * It tucks under the page's bottom edge (PageTransition.tsx) and its
 * content rises out from behind it as it scrolls in (.footer-rise, theme.css).
 */
export default async function Footer() {
  const settings = await getSettings();
  const socialLinks = SOCIAL_LINKS(settings);
  const clinicName = settings.clinicName?.trim() || "Ilaj Dental Care";

  return (
    <footer className="footer-parallax relative z-0 -mt-10 w-full bg-neutral-900 pt-10 text-white lg:-mt-12 lg:pt-12">
      <div className="footer-rise mx-auto max-w-7xl px-5 pb-8 pt-14 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20">

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">

          {/* Social links — hairline-bordered list */}
          <div className="lg:col-span-3">
            {socialLinks.length > 0 && (
              <ul className="divide-y divide-white/15 border-y border-white/15">
                {socialLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group flex items-center justify-between py-3.5 ${linkClass}`}
                    >
                      {link.label}
                      <ArrowUpRight
                        aria-hidden="true"
                        className="size-4 text-brand transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Navigation */}
          <div className="lg:col-span-3">
            <h3><MetaText as="span" tone="light">Navigation</MetaText></h3>
            <ul className="mt-5 space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h3><MetaText as="span" tone="light">Contact</MetaText></h3>
            <ul className="mt-5 space-y-2.5">
              {settings.primaryEmail && (
                <li>
                  <a href={`mailto:${settings.primaryEmail}`} className={linkClass}>
                    {settings.primaryEmail}
                  </a>
                </li>
              )}
              {settings.whatsappNumber && (
                <li>
                  <a
                    href={toWhatsAppLink(settings.whatsappNumber)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                  >
                    Whatsapp : {settings.whatsappNumber}
                  </a>
                </li>
              )}
              {settings.phone1 && (
                <li>
                  <a href={toTelLink(settings.phone1)} className={linkClass}>
                    {settings.phone1}
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Legal */}
          <div className="lg:col-span-3">
            <h3><MetaText as="span" tone="light">Legal</MetaText></h3>
            <ul className="mt-5 space-y-2.5">
              {LEGAL_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center gap-6 border-t border-white/15 pt-8 sm:flex-row sm:justify-between">
          <span className="text-xl font-bold tracking-tight">{clinicName}</span>
          <p className="text-sm text-white/60">
            © {new Date().getFullYear()} {clinicName}. All rights reserved.
          </p>
          <BackToTopButton />
        </div>

      </div>
    </footer>
  );
}
