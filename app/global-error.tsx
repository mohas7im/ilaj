"use client";

import { Geist, Manrope } from "next/font/google";
import SectionTitle from "@/components/website/common/SectionTitle";
import SectionDescription from "@/components/website/common/SectionDescription";
import Button from "@/components/website/ui/Button";
import "@/styles/website/theme.css";

// Shown when a root layout fails (e.g. the database is being updated).
// Replaces the whole document, so it owns <html>/<body>, fonts and the stylesheet.
// Never show the error message or digest to visitors.

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html
      lang="en"
      data-website-theme
      className={`${geist.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col items-center justify-center gap-6 bg-white px-4 text-center">
        <title>We&apos;re updating our website</title>
        <SectionTitle as="h1">We&apos;re updating our website</SectionTitle>
        <SectionDescription>Please try again in a few minutes.</SectionDescription>
        <Button onClick={() => reset()}>Try again</Button>
      </body>
    </html>
  );
}
