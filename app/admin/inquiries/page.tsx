"use client"

import { useState, useEffect, useCallback } from "react"
import { format } from "date-fns"
import { toast } from "sonner"
import { PageHeader } from "@/components/admin/PageHeader"
import { InquiryFilters, type InquiryFilterState } from "./_components/InquiryFilters"
import { InquiryTable } from "./_components/InquiryTable"
import { fetchInquiries, deleteInquiry } from "./_services/inquiry.service"
import type { Inquiry } from "./_types/inquiry.types"

export default function InquiriesPage() {
  const [filters, setFilters] = useState<InquiryFilterState>({
    search: "",
    treatment: "all",
    dateFrom: undefined,
    dateTo: undefined,
  })

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  // Debounce search query to avoid excess backend requests while typing
  const [debouncedSearch, setDebouncedSearch] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search)
    }, 300)
    return () => clearTimeout(timer)
  }, [filters.search])

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true)
      const fromStr = filters.dateFrom ? format(filters.dateFrom, "yyyy-MM-dd") : undefined
      const toStr = filters.dateTo ? format(filters.dateTo, "yyyy-MM-dd") : undefined

      const response = await fetchInquiries({
        page,
        limit: pageSize,
        search: debouncedSearch,
        treatment: filters.treatment,
        from: fromStr,
        to: toStr,
      })

      setInquiries(response.inquiries)
      setTotal(response.pagination.total)
      setTotalPages(response.pagination.totalPages)
    } catch (error) {
      console.error("Failed to load inquiries:", error)
      toast.error("Failed to load inquiries")
    } finally {
      setIsLoading(false)
    }
  }, [page, pageSize, debouncedSearch, filters.treatment, filters.dateFrom, filters.dateTo])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleFiltersChange = (newFilters: InquiryFilterState) => {
    setFilters(newFilters)
    setPage(1)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize)
    setPage(1)
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteInquiry(id)
      toast.success("Inquiry deleted successfully")
      if (inquiries.length === 1 && page > 1) {
        setPage((p) => p - 1)
      } else {
        loadData()
      }
    } catch {
      toast.error("Failed to delete inquiry")
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inquiries"
        description="Review and manage inquiries received from your website contact form."
      />

      <InquiryFilters filters={filters} onFiltersChange={handleFiltersChange} />

      <InquiryTable
        inquiries={inquiries}
        isLoading={isLoading}
        page={page}
        pageSize={pageSize}
        total={total}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onDelete={handleDelete}
      />
    </div>
  )
}
