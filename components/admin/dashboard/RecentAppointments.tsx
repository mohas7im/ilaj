import { MoreHorizontal } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/admin/ui/table"
import { Badge } from "@/components/admin/ui/badge"
import { Avatar, AvatarFallback } from "@/components/admin/ui/avatar"
import { Button } from "@/components/admin/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/admin/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/admin/ui/card"
import type { Appointment, AppointmentStatus } from "@/features/admin/dashboard/data"

// ─── Status badge config ──────────────────────────────────────────────────────

const STATUS_MAP: Record<
  AppointmentStatus,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
  confirmed: { label: "Confirmed", variant: "default" },
  pending:   { label: "Pending",   variant: "secondary" },
  completed: { label: "Completed", variant: "outline" },
  cancelled: { label: "Cancelled", variant: "destructive" },
}

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

// ─── RecentAppointments ───────────────────────────────────────────────────────

type RecentAppointmentsProps = {
  appointments: Appointment[]
}

export function RecentAppointments({ appointments }: RecentAppointmentsProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Recent Appointments</CardTitle>
        <CardDescription>Latest appointment activity</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead className="hidden sm:table-cell">Doctor</TableHead>
                <TableHead className="hidden md:table-cell">Service</TableHead>
                <TableHead className="hidden lg:table-cell">Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-8">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appt) => {
                const { label, variant } = STATUS_MAP[appt.status]
                return (
                  <TableRow key={appt.id}>
                    {/* Patient */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7 shrink-0">
                          <AvatarFallback className="text-xs">
                            {initials(appt.patient)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{appt.patient}</span>
                      </div>
                    </TableCell>

                    {/* Doctor */}
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                      {appt.doctor}
                    </TableCell>

                    {/* Service */}
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {appt.service}
                    </TableCell>

                    {/* Date & Time */}
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                      <div className="flex flex-col">
                        <span>{appt.date}</span>
                        <span className="text-xs">{appt.time}</span>
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Badge variant={variant} aria-label={`Status: ${label}`}>
                        {label}
                      </Badge>
                    </TableCell>

                    {/* Actions */}
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <button
                              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                              aria-label={`Actions for ${appt.patient}`}
                            >
                              <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                            </button>
                          }
                        />
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View details</DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive focus:text-destructive">
                            Cancel
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
