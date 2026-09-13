import { CLINIC_SETTINGS } from "@/app/admin/settings/_services/settings.service"
import { COMMON_SEO } from "@/app/admin/seo/_services/seo.service"

// ─── generateLocalBusinessSchema ─────────────────────────────────────────────
// Generates MedicalClinic / Dentist JSON-LD structured data automatically
// from existing Settings data. No manual input from the admin.

export function generateLocalBusinessSchema(): Record<string, unknown> {
  const s = CLINIC_SETTINGS
  const seo = COMMON_SEO
  const baseUrl = seo.siteUrl.replace(/\/$/, "")

  return {
    "@context": "https://schema.org",
    "@type": ["Dentist", "MedicalClinic", "LocalBusiness"],
    name: seo.siteName,
    url: baseUrl,
    telephone: s.phone1,
    email: s.primaryEmail,
    address: {
      "@type": "PostalAddress",
      streetAddress: s.address,
    },
    openingHoursSpecification: [
      // Monday – Friday
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: s.workingHoursWeekday.split(" - ")[0]?.replace(" AM", ":00").replace(" PM", ":00") ?? "09:00",
        closes: s.workingHoursWeekday.split(" - ")[1]?.replace(" AM", ":00").replace(" PM", ":00") ?? "20:00",
      },
      // Saturday
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday"],
        opens: s.workingHoursSaturday.split(" - ")[0]?.replace(" AM", ":00").replace(" PM", ":00") ?? "10:00",
        closes: s.workingHoursSaturday.split(" - ")[1]?.replace(" AM", ":00").replace(" PM", ":00") ?? "18:00",
      },
      // Sunday (only if open)
      ...(s.sundayOpen && s.workingHoursSunday
        ? [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: ["Sunday"],
              opens: s.workingHoursSunday.split(" - ")[0]?.replace(" AM", ":00").replace(" PM", ":00") ?? "11:00",
              closes: s.workingHoursSunday.split(" - ")[1]?.replace(" AM", ":00").replace(" PM", ":00") ?? "16:00",
            },
          ]
        : []),
    ],
    sameAs: [
      s.facebook  ? `https://www.facebook.com/${s.facebook}` : null,
      s.instagram ? `https://www.instagram.com/${s.instagram}` : null,
      s.linkedin  ? `https://www.linkedin.com/company/${s.linkedin}` : null,
      s.twitter   ? `https://twitter.com/${s.twitter}` : null,
    ].filter(Boolean),
  }
}

// ─── generateBreadcrumbSchema ─────────────────────────────────────────────────
// Generates BreadcrumbList schema for a given page.

export function generateBreadcrumbSchema(
  items: { name: string; url: string }[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
