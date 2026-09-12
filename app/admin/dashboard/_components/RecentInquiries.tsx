import Link from "next/link"
import { ArrowRight, Stethoscope, Calendar, Clock } from "lucide-react"
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
                <TableHead>Treatment</TableHead>
                <TableHead className="hidden md:table-cell">Preferred Slot</TableHead>
                <TableHead className="text-right">Received</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inquiries.map((inquiry) => {
                const displayName = inquiry.fullName || inquiry.name
                return (
                  <TableRow key={inquiry.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7 shrink-0">
                          <AvatarFallback className="text-xs">
                            {initials(displayName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{displayName}</span>
                          <span className="text-xs text-muted-foreground">{inquiry.email}</span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs font-medium">
                        <Stethoscope className="h-3 w-3 text-primary shrink-0" />
                        <span>{inquiry.treatment}</span>
                      </div>
                    </TableCell>

                    <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span>{inquiry.preferredDate}</span>
                      </div>
                    </TableCell>

                    <TableCell className="text-right text-xs text-muted-foreground">
                      {inquiry.time}
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
