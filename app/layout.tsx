import type { Metadata } from "next";
import { Poppins, Geist, Manrope } from "next/font/google";
import { getClinicSettings } from "@/server/services/settings.service";
import { getCommonSeo } from "@/app/admin/seo/_services/seo.service";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-admin",
  display: "swap",
});

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
  const [common, settings] = await Promise.all([
    getCommonSeo(),
    getClinicSettings(),
  ]);

  const siteName = settings.clinicName || common.siteName;
  const description = settings.tagline || common.defaultDescription;

  return {
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description,
    robots: {
      index: true,
      follow: true,
    },
  };
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${geist.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
