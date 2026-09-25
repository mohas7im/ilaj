import { format } from "date-fns"
import {
  Layers,
  Sparkles,
  Link2,
  Calendar,
  ImageIcon,
  Hash,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card"
import { Badge } from "@/components/admin/ui/badge"
import type { Service } from "@/domain/service/service.types"
import { SERVICE_STATUS_CONFIG } from "./service-status"

type ServiceDetailsProps = {
  service: Service
}

function DetailRow({
  icon: Icon,
  label,
  children,
}: {
  icon?: React.ComponentType<{ className?: string }>
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2 py-3 items-center">
      <dt className="flex items-center gap-2 text-sm text-muted-foreground">
        {Icon && <Icon className="h-4 w-4 text-muted-foreground/80 shrink-0" />}
        <span>{label}</span>
      </dt>
      <dd className="sm:col-span-2 text-sm font-medium break-words text-foreground">
        {children}
      </dd>
    </div>
  )
}

export function ServiceDetails({ service }: ServiceDetailsProps) {
  const { label, variant } = SERVICE_STATUS_CONFIG[service.status] ?? {
    label: service.status,
    variant: "outline",
  }

  const formattedCreated = service.createdAt
    ? format(new Date(service.createdAt), "PPP p")
    : null
  const formattedUpdated = service.updatedAt
    ? format(new Date(service.updatedAt), "PPP p")
    : null

  return (
    <div className="space-y-6">
      {/* Service Overview Card */}
      <Card>
        <CardHeader className="pb-3 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold">{service.name}</CardTitle>
                {service.slug && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5 font-mono">
                    <Link2 className="h-3 w-3" />
                    /{service.slug}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={variant}>{label}</Badge>
              {service.showInHomePage && (
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  Home Page Featured
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <dl className="divide-y">
            <DetailRow icon={Layers} label="Service Name">
              <span>{service.name}</span>
            </DetailRow>
            <DetailRow icon={Link2} label="Slug">
              <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">
                {service.slug || "—"}
              </span>
            </DetailRow>
            <DetailRow icon={Hash} label="Display Order">
              <span>{service.displayOrder ?? 1}</span>
            </DetailRow>
            <DetailRow icon={Sparkles} label="Featured on Home">
              <span>{service.showInHomePage ? "Yes" : "No"}</span>
            </DetailRow>
            {formattedCreated && (
              <DetailRow icon={Calendar} label="Created At">
                <span>{formattedCreated}</span>
              </DetailRow>
            )}
            {formattedUpdated && (
              <DetailRow icon={Calendar} label="Last Updated">
                <span>{formattedUpdated}</span>
              </DetailRow>
            )}
          </dl>
        </CardContent>
      </Card>

      {/* Description Card */}
      <Card>
        <CardHeader className="pb-3 border-b">
          <CardTitle className="text-base font-medium">Description</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {service.description ? (
            <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
              {service.description}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground italic">No description provided for this service.</p>
          )}
        </CardContent>
      </Card>

      {/* Media / Photos Card */}
      <Card>
        <CardHeader className="pb-3 border-b">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-primary" />
            Service Images
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Primary Image */}
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Primary Image
              </span>
              <div className="relative aspect-video w-full rounded-lg border overflow-hidden bg-muted/20 flex items-center justify-center">
                {service.image ? (
                  <img
                    src={service.image}
                    alt={service.imageAlt || service.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1.5 text-muted-foreground">
                    <ImageIcon className="h-8 w-8 opacity-40" />
                    <span className="text-xs">No primary image uploaded</span>
                  </div>
                )}
              </div>
              {service.imageAlt && (
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Alt text:</span> {service.imageAlt}
                </p>
              )}
            </div>

            {/* Secondary Image */}
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Secondary Image
              </span>
              <div className="relative aspect-video w-full rounded-lg border overflow-hidden bg-muted/20 flex items-center justify-center">
                {service.secondaryImage ? (
                  <img
                    src={service.secondaryImage}
                    alt={service.secondaryImageAlt || `${service.name} secondary`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1.5 text-muted-foreground">
                    <ImageIcon className="h-8 w-8 opacity-40" />
                    <span className="text-xs">No secondary image uploaded</span>
                  </div>
                )}
              </div>
              {service.secondaryImageAlt && (
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Alt text:</span> {service.secondaryImageAlt}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
