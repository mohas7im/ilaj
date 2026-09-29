import { NextResponse } from "next/server"
import { getAllSeo } from "@/server/services/seo.service"
import { requireAdmin } from "@/lib/auth/require-admin"

// GET /api/admin/seo/all — common SEO + every page's SEO in one call.
// Used by the admin SEO screen so switching tabs is instant without firing
// one request per page.
export async function GET() {
  const denied = await requireAdmin()
  if (denied) return denied

  const seo = await getAllSeo()
  return NextResponse.json(seo)
}
