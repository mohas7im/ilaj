"use client"

import { useState, useRef, useEffect, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ShieldCheck, ArrowLeft, Loader2 } from "lucide-react"

import { ADMIN_BRANDING } from "@/lib/admin/config"
import { useAdminBranding } from "@/components/admin/layout/AdminBranding"
import { Button } from "@/components/admin/ui/button"
import { Label } from "@/components/admin/ui/label"

function TwoFactorContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const emailParam = searchParams.get("email") ?? ""
  const branding = useAdminBranding()

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Auto-focus first digit slot on mount
  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const handleOtpChange = (index: number, value: string) => {
    // Only accept numeric input
    const cleanVal = value.replace(/\D/g, "")

    if (!cleanVal) {
      const newOtp = [...otp]
      newOtp[index] = ""
      setOtp(newOtp)
      return
    }

    // Handle single character
    const char = cleanVal.slice(-1)
    const newOtp = [...otp]
    newOtp[index] = char
    setOtp(newOtp)
    setError(null)

    // Auto-focus next input slot
    if (index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus()
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault()
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === "ArrowRight" && index < 5) {
      e.preventDefault()
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    if (!pastedData) return

    const newOtp = [...otp]
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pastedData[i] || ""
    }
    setOtp(newOtp)
    setError(null)

    // Focus last filled index or next empty
    const nextIndex = Math.min(pastedData.length, 5)
    inputRefs.current[nextIndex]?.focus()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const code = otp.join("")
    if (code.length < 6) {
      setError("Please enter the complete 6-digit verification code.")
      return
    }

    setLoading(true)
    setTimeout(() => {
      router.push("/admin/dashboard")
    }, 600)
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
            alt=""
            className="absolute inset-0 h-full w-full object-cover brightness-90"
          />

          {/* Moody cinematic gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

          {/* Top Clinic Branding */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-xs">
              {branding.shortName}
            </div>
            <div>
              <span className="text-sm font-semibold tracking-tight text-white block">
                {branding.name}
              </span>
              <span className="text-xs text-white/70 block">
                {ADMIN_BRANDING.description}
              </span>
            </div>
          </div>

          {/* Bottom Quote */}
          <div className="relative z-10 space-y-3 max-w-md">
            <h2 className="text-2xl xl:text-3xl font-light tracking-tight text-white leading-snug">
              Secure access for clinic staff <br />
              <span className="font-normal">protecting your patient health records.</span>
            </h2>
            <p className="text-xs text-white/80 font-medium tracking-wide uppercase">
              {[branding.name, "Protected Administration"].filter(Boolean).join(" — ")}
            </p>
          </div>
        </div>
      </div>

      {/* ── Right Side: 2FA Verification Form ── */}
      <div className="flex flex-1 flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 min-h-screen">
        {/* Top Header Navigation */}
        <div className="flex items-center justify-between w-full max-w-sm mx-auto">
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            Back to login
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Back to website
          </Link>
        </div>

        {/* 2FA Form Container */}
        <div className="w-full max-w-sm mx-auto my-auto py-8">
          {/* Security Icon Badge */}
          <div className="mb-5 inline-flex items-center justify-center size-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary shadow-xs">
            <ShieldCheck className="size-6" />
          </div>

          {/* Title & Description */}
          <div className="space-y-1.5 mb-6">
            <h1 className="text-2xl font-semibold tracking-tight">
              Two-Factor Authentication
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter the 6-digit verification code from your authenticator app
              {emailParam && (
                <>
                  {" "}for <span className="font-medium text-foreground">{emailParam}</span>
                </>
              )}
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 px-3.5 py-2.5 text-xs text-destructive flex items-center gap-2 animate-in fade-in-50">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 6-Digit OTP Box Grid */}
            <div className="space-y-2">
              <Label htmlFor="otp-0">Verification Code</Label>
              <div className="flex items-center justify-between gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    ref={(el) => {
                      inputRefs.current[index] = el
                    }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="size-11 sm:size-12 text-center text-lg font-mono font-semibold rounded-lg border border-input bg-transparent focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 outline-none transition-all dark:bg-input/30"
                    aria-label={`Digit ${index + 1} of verification code`}
                    autoComplete={index === 0 ? "one-time-code" : "off"}
                  />
                ))}
              </div>
            </div>

            {/* Verify Button */}
            <div className="pt-2">
              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" />
                    Verifying...
                  </span>
                ) : (
                  "Verify & Sign in"
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="w-full max-w-sm mx-auto text-center">
          <p className="text-xs text-muted-foreground">
            {[branding.name, "Clinic Administration"].filter(Boolean).join(" • ")}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function AdminTwoFactorPage() {
  return (
    <Suspense
      fallback={
        <div data-admin-theme className="min-h-screen w-full flex items-center justify-center bg-background text-foreground">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      }
    >
      <TwoFactorContent />
    </Suspense>
  )
}
