import Link from "next/link"
import { ArrowRight, Eye } from "lucide-react"
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
import type { DashboardInquiry } from "../_services/dashboard.service"

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
          <CardDescription>Latest consultation bookings and requests</CardDescription>
        </div>
        <Button variant="ghost" size="sm" render={<Link href="/admin/inquiries" />}>
          View all
          <ArrowRight className="ml-1 h-3.5 w-3.5" />
        </Button>
      </CardHeader>
      <CardContent className="p-0">
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
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inquiries.map((inquiry) => {
                const displayName = inquiry.fullName || inquiry.name || "Anonymous"
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
                      {inquiry.treatment || inquiry.subject || "General Checkup"}
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
                      {inquiry.createdAt
                        ? new Date(inquiry.createdAt).toLocaleDateString()
                        : inquiry.time || "Recent"}
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="outline"
                          size="icon-sm"
                          title="View details"
                          aria-label={`View inquiry from ${displayName}`}
                          render={<Link href={`/admin/inquiries/${inquiry.id}`} />}
                        >
                          <Eye className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
