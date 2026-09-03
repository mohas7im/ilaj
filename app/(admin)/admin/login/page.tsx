import "@/styles/admin/theme.css"
import { ADMIN_BRANDING } from "@/lib/admin/config"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/admin/ui/card"
import { Input } from "@/components/admin/ui/input"
import { Label } from "@/components/admin/ui/label"
import { Button } from "@/components/admin/ui/button"
import { Separator } from "@/components/admin/ui/separator"

export const metadata = {
  title: `Login — ${ADMIN_BRANDING.name}`,
}

export default function AdminLoginPage() {
  return (
    <div data-admin-theme className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Brand mark */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground text-lg font-bold select-none">
            {ADMIN_BRANDING.shortName}
          </div>
          <h1 className="text-xl font-semibold">{ADMIN_BRANDING.name}</h1>
          <p className="text-sm text-muted-foreground">{ADMIN_BRANDING.description}</p>
        </div>

        <Card>
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-base">Sign in</CardTitle>
            <CardDescription>Enter your credentials to continue</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Authentication will be wired here — form is intentionally static for now */}
            <form className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  autoComplete="email"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>
              <Button type="button" className="w-full">
                Sign in
              </Button>
            </form>

            <Separator className="my-4" />

            <p className="text-center text-xs text-muted-foreground">
              Authentication will be added in a future update.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
