"use client"

import { useState } from "react"
import { TestimonialFilters, type TestimonialFilterState } from "./TestimonialFilters"
import { TestimonialTable } from "./TestimonialTable"
import type { Testimonial } from "../_types/testimonial.types"

export function TestimonialsClientView({ initialTestimonials }: { initialTestimonials: Testimonial[] }) {
  const [filters, setFilters] = useState<TestimonialFilterState>({
    search: "",
    rating: "all",
  })

  return (
    <div className="space-y-4">
      <TestimonialFilters filters={filters} onFiltersChange={setFilters} />
      <TestimonialTable testimonials={initialTestimonials} filters={filters} />
    </div>
  )
}
