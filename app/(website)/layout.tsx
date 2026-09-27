import type { Metadata } from "next";
import { Geist, Manrope } from "next/font/google";
import { generateRootMetadata } from "@/lib/seo";
import Navbar from "@/components/website/layout/Navbar";
import Footer from "@/components/website/layout/Footer";
import SmoothScroll from "@/components/website/layout/SmoothScroll";
import PageTransition from "@/components/website/layout/PageTransition";
import "@/styles/website/theme.css";

// Website root layout — owns <html>/<body>, fonts and the website stylesheet.
// Independent of app/admin/, which has its own root layout.
// For a new client, replace this folder, components/website/ and
// styles/website/theme.css.

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

export async function generateMetadata(): Promise<Metadata> {
  return generateRootMetadata();
}

export default function WebsiteRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-website-theme
      className={`${geist.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative">
        <SmoothScroll />
        <Navbar />
        <PageTransition>{children}</PageTransition>
        <Footer />
      </body>
    </html>
  );
}
