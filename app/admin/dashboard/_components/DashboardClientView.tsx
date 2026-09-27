"use client"

import { useEffect, useState } from "react"
import { MessageSquare, Stethoscope, Briefcase, Star } from "lucide-react"
import { toast } from "sonner"
import { DashboardSection } from "./DashboardSection"
import { StatsCard } from "./StatsCard"
import { RecentInquiries } from "./RecentInquiries"
import {
  fetchDashboardStats,
  fetchDashboardInquiries,
} from "../_services/dashboard.api"
import type {
  DashboardStats,
  DashboardInquiry,
} from "../_types/dashboard.types"
import { Skeleton } from "@/components/admin/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/admin/ui/card"

export function DashboardClientView() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [inquiries, setInquiries] = useState<DashboardInquiry[]>([])
  const [loadingStats, setLoadingStats] = useState(true)
  const [loadingInquiries, setLoadingInquiries] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadStats() {
      try {
        setLoadingStats(true)
        const data = await fetchDashboardStats()
        if (isMounted) {
          setStats(data)
        }
      } catch (err) {
        console.error("Failed to load dashboard stats:", err)
        toast.error("Failed to load statistics summary")
      } finally {
        if (isMounted) setLoadingStats(false)
      }
    }

    async function loadInquiries() {
      try {
        setLoadingInquiries(true)
        const data = await fetchDashboardInquiries({ pageNumber: 1, pageSize: 5 })
        if (isMounted) {
          setInquiries(data.inquiries || [])
        }
      } catch (err) {
        console.error("Failed to load recent inquiries:", err)
        toast.error("Failed to load recent inquiries")
      } finally {
        if (isMounted) setLoadingInquiries(false)
      }
    }

    loadStats()
    loadInquiries()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <DashboardSection>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {loadingStats || !stats ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-7 w-16" />
                    </div>
                    <Skeleton className="h-10 w-10 rounded-lg" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <>
              <StatsCard
                title="Total Inquiries"
                value={stats.totalInquiries}
                icon={MessageSquare}
              />
              <StatsCard
                title="Doctors"
                value={stats.totalDoctors}
                icon={Stethoscope}
              />
              <StatsCard
                title="Services"
                value={stats.totalServices}
                icon={Briefcase}
              />
              <StatsCard
                title="Testimonials"
                value={stats.totalTestimonials}
                icon={Star}
              />
            </>
          )}
        </div>
      </DashboardSection>

      {/* Recent Inquiries */}
      {loadingInquiries ? (
        <Card>
          <CardHeader className="pb-2">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-52" />
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      ) : (
        <RecentInquiries inquiries={inquiries} />
      )}
    </div>
  )
}
