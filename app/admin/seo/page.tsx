import { PageHeader } from "@/components/admin/PageHeader"
import { getCommonSeo, getPageSeo } from "./_services/seo.service"
import { SeoForm } from "./_components/SeoForm"

export const metadata = {
  title: "SEO",
  robots: { index: false, follow: false },
}

export default async function SeoPage() {
  // Pre-load common SEO and all page SEO configs for the client form
  const [commonSeo, homeSeo, aboutSeo, servicesSeo, doctorsSeo, gallerySeo, testimonialsSeo, whyChooseUsSeo, contactSeo] =
    await Promise.all([
      getCommonSeo(),
      getPageSeo("home"),
      getPageSeo("about"),
      getPageSeo("services"),
      getPageSeo("doctors"),
      getPageSeo("gallery"),
      getPageSeo("testimonials"),
      getPageSeo("why-choose-us"),
      getPageSeo("contact"),
    ])

  const initialPageSeoMap = {
    home:          homeSeo,
    about:         aboutSeo,
    services:      servicesSeo,
    doctors:       doctorsSeo,
    gallery:       gallerySeo,
    testimonials:  testimonialsSeo,
    "why-choose-us": whyChooseUsSeo,
    contact:       contactSeo,
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="SEO"
        description="Manage search engine optimisation for each public page of your website."
      />
      <SeoForm initialCommonSeo={commonSeo} initialPageSeoMap={initialPageSeoMap} />
    </div>
  )
}
