import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { format } from "date-fns"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/admin/ui/table"
import { Avatar, AvatarFallback } from "@/components/admin/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/admin/ui/card"
import { Button } from "@/components/admin/ui/button"
import type { DashboardInquiry } from "../_types/dashboard.types"

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

type RecentInquiriesProps = {
  inquiries: DashboardInquiry[]
}

export function RecentInquiries({ inquiries }: RecentInquiriesProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-base">Recent Inquiries</CardTitle>
          <CardDescription>Latest consultation bookings and inquiries received</CardDescription>
        </div>
        <Button variant="ghost" size="sm" render={<Link href="/admin/inquiries" />}>
          View all
          <ArrowRight className="ml-1 h-3.5 w-3.5" />
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {inquiries.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            No inquiries received yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead className="hidden sm:table-cell">Treatment</TableHead>
                  <TableHead className="hidden md:table-cell">Preferred Slot</TableHead>
                  <TableHead className="hidden lg:table-cell">Email</TableHead>
                  <TableHead className="hidden lg:table-cell">Phone</TableHead>
                  <TableHead className="hidden sm:table-cell">Received</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inquiries.map((inquiry) => {
                  const displayName = inquiry.fullName || "Anonymous"
                  let receivedDate = "—"
                  if (inquiry.createdAt) {
                    try {
                      receivedDate = format(new Date(inquiry.createdAt), "MMM d, yyyy")
                    } catch {
                      receivedDate = String(inquiry.createdAt)
                    }
                  }

                  return (
                    <TableRow key={inquiry.id}>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <Avatar className="h-8 w-8 shrink-0">
                            <AvatarFallback className="text-xs">
                              {initials(displayName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">{displayName}</span>
                            <span className="text-xs text-muted-foreground sm:hidden">
                              {inquiry.phone || inquiry.email}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                        {inquiry.treatment || "General Consultation"}
                      </TableCell>

                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                        {inquiry.preferredDate || "—"}
                        {inquiry.preferredTime ? ` • ${inquiry.preferredTime}` : ""}
                      </TableCell>

                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                        {inquiry.email}
                      </TableCell>

                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                        {inquiry.phone || "—"}
                      </TableCell>

                      <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">
                        {receivedDate}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
