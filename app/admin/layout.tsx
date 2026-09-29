import type { Metadata } from "next"
import { Poppins, Geist } from "next/font/google"
import { generateAdminRootMetadata } from "@/lib/seo"
import { connection } from "next/server"
import { AdminShell } from "@/components/admin/layout/AdminShell"
import { AdminBrandingProvider } from "@/components/admin/layout/AdminBranding"
import { getClinicSettings } from "@/server/services/settings.service"
import "@/styles/admin/theme.css"

// Admin root layout — owns <html>/<body>, fonts and the admin stylesheet.
// Independent of app/(website)/, which has its own root layout.

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-admin",
  display: "swap",
})

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
})

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminRootMetadata()
}

export default async function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Read per request, so a new Settings → Clinic Name shows without a rebuild
  await connection()
  const { clinicName } = await getClinicSettings()

  return (
    <html
      lang="en"
      data-admin-theme
      className={`${poppins.variable} ${geist.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AdminBrandingProvider clinicName={clinicName}>
          <AdminShell>{children}</AdminShell>
        </AdminBrandingProvider>
      </body>
    </html>
  )
}
