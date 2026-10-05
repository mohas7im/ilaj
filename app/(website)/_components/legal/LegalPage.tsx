import Link from "next/link";
import { Container } from "@/components/website/common/Section";
import SectionLabel from "@/components/website/common/SectionLabel";
import SectionTitle from "@/components/website/common/SectionTitle";
import SectionDescription from "@/components/website/common/SectionDescription";

const LEGAL_PAGES = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" },
  { label: "Medical Disclaimer", href: "/medical-disclaimer" },
];

// Shared shell for the legal pages: heading, "last updated" date, the policy
// text (styled by .rich-text, theme.css) and links to the other legal pages.
export default function LegalPage({
  title,
  intro,
  lastUpdated,
  currentHref,
  children,
}: {
  title: string;
  intro: string;
  /** When this page's wording last changed, e.g. "5 October 2026" */
  lastUpdated: string;
  currentHref: string;
  children: React.ReactNode;
}) {
  return (
    <main className="pt-20">
      <Container className="py-16 lg:py-24">
        <div className="mx-auto max-w-3xl">
          <SectionLabel>Legal</SectionLabel>
          <SectionTitle as="h1">{title}</SectionTitle>
          <SectionDescription className="mt-4">{intro}</SectionDescription>
          <p className="mt-4 text-sm text-zinc-500">Last updated: {lastUpdated}</p>

          <article className="rich-text mt-12 border-t border-zinc-200 pt-10">{children}</article>

          <nav aria-label="Legal pages" className="mt-16 flex flex-wrap gap-x-6 gap-y-2 border-t border-zinc-200 pt-8 text-sm">
            {LEGAL_PAGES.filter((page) => page.href !== currentHref).map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className="font-semibold text-zinc-700 underline underline-offset-4 transition-colors hover:text-brand"
              >
                {page.label}
              </Link>
            ))}
          </nav>
        </div>
      </Container>
    </main>
  );
}
