"use client"

import { useState } from "react"
import { PageHeader } from "@/components/admin/PageHeader"
import { TestimonialFilters, type TestimonialFilterState } from "./_components/TestimonialFilters"
import { TestimonialTable } from "./_components/TestimonialTable"
import { MOCK_TESTIMONIALS } from "./_services/testimonial.service"

export default function TestimonialsPage() {
  const [filters, setFilters] = useState<TestimonialFilterState>({
    search: "",
    rating: "all",
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Testimonials"
        description="Patient reviews, ratings, and feedback displayed on the clinic website."
        actions={[
          {
            label: "+ Add Testimonial",
            href: "/admin/testimonials/create",
          },
        ]}
      />
      <TestimonialFilters filters={filters} onFiltersChange={setFilters} />
      <TestimonialTable testimonials={MOCK_TESTIMONIALS} filters={filters} />
    </div>
  )
}
