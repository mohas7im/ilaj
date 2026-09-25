"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { format } from "date-fns"
import { toast } from "sonner"
import { InquiryFilters, type InquiryFilterState } from "./InquiryFilters"
import { InquiryTable } from "./InquiryTable"
import { fetchInquiries, deleteInquiry } from "../_services/inquiry.api"
import type { Inquiry, InquiryPaginatedResponse } from "../_types/inquiry.types"

interface InquiriesClientViewProps {
  initialData: InquiryPaginatedResponse
}

export function InquiriesClientView({ initialData }: InquiriesClientViewProps) {
  const [filters, setFilters] = useState<InquiryFilterState>({
    search: "",
    treatment: "all",
    dateFrom: undefined,
    dateTo: undefined,
  })

  const [pageNumber, setPageNumber] = useState(initialData.pagination.pageNumber)
  const [pageSize, setPageSize] = useState(initialData.pagination.pageSize)
  const [inquiries, setInquiries] = useState<Inquiry[]>(initialData.inquiries)
  const [total, setTotal] = useState(initialData.pagination.total)
  const [totalPages, setTotalPages] = useState(initialData.pagination.totalPages)
  const [isLoading, setIsLoading] = useState(false)

  // Track if initial mount has occurred so we don't refetch on first render
  const isInitialMount = useRef(true)

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
      const fromStr = filters.dateFrom
        ? format(filters.dateFrom, "yyyy-MM-dd")
        : undefined
      const toStr = filters.dateTo
        ? format(filters.dateTo, "yyyy-MM-dd")
        : undefined

      const response = await fetchInquiries({
        pageNumber,
        pageSize,
        search: debouncedSearch,
        treatment: filters.treatment,
        from: fromStr,
        to: toStr,
      })

      if (response && Array.isArray(response.inquiries)) {
        setInquiries(response.inquiries)
        setTotal(response.pagination.total)
        setTotalPages(response.pagination.totalPages)
      }
    } catch (error) {
      console.error("Failed to load inquiries:", error)
      toast.error("Failed to load inquiries")
    } finally {
      setIsLoading(false)
    }
  }, [pageNumber, pageSize, debouncedSearch, filters.treatment, filters.dateFrom, filters.dateTo])

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    loadData()
  }, [loadData])

  const handleFiltersChange = (newFilters: InquiryFilterState) => {
    setFilters(newFilters)
    setPageNumber(1)
  }

  const handlePageChange = (newPageNumber: number) => {
    setPageNumber(newPageNumber)
  }

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize)
    setPageNumber(1)
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteInquiry(id)
      toast.success("Inquiry deleted successfully")
      if (inquiries.length === 1 && pageNumber > 1) {
        setPageNumber((p) => p - 1)
      } else {
        loadData()
      }
    } catch (error) {
      console.error("Failed to delete inquiry:", error)
      toast.error("Failed to delete inquiry")
    }
  }

  return (
    <div className="space-y-4">
      <InquiryFilters filters={filters} onFiltersChange={handleFiltersChange} />

      <InquiryTable
        inquiries={inquiries}
        isLoading={isLoading}
        pageNumber={pageNumber}
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
