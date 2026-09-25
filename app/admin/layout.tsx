import type { Metadata } from "next"
import { Poppins, Geist } from "next/font/google"
import { generateRootMetadata } from "@/lib/seo"
import { AdminShell } from "@/components/admin/layout/AdminShell"
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
  return generateRootMetadata()
}

export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      data-admin-theme
      className={`${poppins.variable} ${geist.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  )
}
