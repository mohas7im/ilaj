"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { TestimonialFilters, type TestimonialFilterState } from "./TestimonialFilters"
import { TestimonialTable } from "./TestimonialTable"
import { testimonialApiService } from "../_services/testimonial.api"
import { getApiErrorMessage } from "@/lib/api/errors"
import { LoadingState } from "@/components/admin/ui/loading-state"
import type { Testimonial } from "@/domain/testimonial/testimonial.types"

export function TestimonialsClientView() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<TestimonialFilterState>({
    search: "",
    rating: "all",
  })

  useEffect(() => {
    testimonialApiService
      .getAll()
      .then(setTestimonials)
      .catch((error) => toast.error(getApiErrorMessage(error, "Failed to load testimonials")))
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) {
    return <LoadingState spinner label="Loading testimonials..." />
  }

  return (
    <div className="space-y-4">
      <TestimonialFilters filters={filters} onFiltersChange={setFilters} />
      <TestimonialTable testimonials={testimonials} filters={filters} />
    </div>
  )
}
