import { PageHeader } from "@/components/admin/PageHeader"
import { SeoForm } from "./_components/SeoForm"

export const metadata = {
  title: "SEO",
  robots: { index: false, follow: false },
}

export default function SeoPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="SEO"
        description="Manage search engine optimisation for each public page of your website."
      />
      <SeoForm />
    </div>
  )
}
