import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Manrope } from "next/font/google";
import "@/styles/website/theme.css";

// 404 for URLs outside both root layouts (app/(website) and app/admin).
// Requires experimental.globalNotFound in next.config.ts.

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you are looking for does not exist.",
};

export default function GlobalNotFound() {
  return (
    <html
      lang="en"
      data-website-theme
      className={`${geist.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-5xl font-semibold tracking-tight">404</h1>
        <p className="text-muted-foreground">This page does not exist.</p>
        <Link href="/" className="font-medium text-brand hover:text-brand-hover">
          Back to home
        </Link>
      </body>
    </html>
  );
}
