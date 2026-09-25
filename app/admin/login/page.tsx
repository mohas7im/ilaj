"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { ADMIN_BRANDING } from "@/lib/admin/config"
import { Button } from "@/components/admin/ui/button"
import { Input } from "@/components/admin/ui/input"
import { Label } from "@/components/admin/ui/label"
import { Checkbox } from "@/components/admin/ui/checkbox"
import { authService } from "@/services/auth.service"

export default function AdminLoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("admin@ilaj.com")
  const [password, setPassword] = useState("AdminPassword123!")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await authService.login({ email, password })
      toast.success("Signed in successfully!")
      router.push("/admin/dashboard")
    } catch (err) {
      const msg = authService.getErrorMessage(err, "Invalid email or password.")
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      data-admin-theme
      className="min-h-screen w-full bg-background text-foreground flex flex-col lg:flex-row antialiased"
    >
      {/* ── Left Side: Dental Clinic Visual Showcase ── */}
      <div className="hidden lg:flex lg:w-1/2 p-3 lg:p-4 shrink-0">
        <div className="relative w-full h-full min-h-[calc(100vh-2rem)] rounded-3xl border border-border/60 overflow-hidden flex flex-col justify-between p-10 xl:p-12 shadow-md">
          {/* Background Photo */}
          <img
            src="/admin/login-showcase.jpg"
            alt="Ilaj Dental Clinic"
            className="absolute inset-0 h-full w-full object-cover brightness-90"
          />

          {/* Moody cinematic gradient vignette matching reference */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

          {/* Top Clinic Branding */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-xs">
              {ADMIN_BRANDING.shortName}
            </div>
            <div>
              <span className="text-sm font-semibold tracking-tight text-white block">
                {ADMIN_BRANDING.name}
              </span>
              <span className="text-xs text-white/70 block">
                {ADMIN_BRANDING.description}
              </span>
            </div>
          </div>

          {/* Bottom Inspirational Quote */}
          <div className="relative z-10 space-y-3 max-w-md">
            <h2 className="text-2xl xl:text-3xl font-light tracking-tight text-white leading-snug">
              Crafting healthy, confident smiles <br />
              <span className="font-normal">with gentle dental excellence.</span>
            </h2>
            <p className="text-xs text-white/80 font-medium tracking-wide uppercase">
              {ADMIN_BRANDING.name} — Modern Dental Clinic
            </p>
          </div>
        </div>
      </div>

      {/* ── Right Side: Authentication Form ── */}
      <div className="flex flex-1 flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 min-h-screen">
        {/* Top Header */}
        <div className="flex items-center justify-between w-full max-w-sm mx-auto">
          <div className="lg:hidden flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
              {ADMIN_BRANDING.shortName}
            </div>
            <span className="text-sm font-semibold">{ADMIN_BRANDING.name}</span>
          </div>

          <Link
            href="/"
            className="ml-auto inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            Back to website
          </Link>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-sm mx-auto my-auto py-8">
          <div className="space-y-1.5 mb-6">
            <h1 className="text-2xl font-semibold tracking-tight">
              Sign in
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to manage clinic patients, doctors, and services.
            </p>
          </div>
          {error && (
            <div className="mb-4 p-3 rounded-lg text-xs font-medium text-destructive bg-destructive/10 border border-destructive/20">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <span className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  Forgot password?
                </span>
              </div>

              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2 pt-1">
              <Checkbox id="remember" defaultChecked />
              <Label htmlFor="remember">
                Remember me
              </Label>
            </div>

            {/* Action Button */}
            <div className="pt-2">
              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="w-full gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="w-full max-w-sm mx-auto text-center">
          <p className="text-xs text-muted-foreground">
            {ADMIN_BRANDING.name} • Clinic Administration
          </p>
        </div>
      </div>
    </div>
  )
}
