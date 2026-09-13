import { NextResponse } from "next/server"
import { getCommonSeo, updateCommonSeo } from "@/app/admin/seo/_services/seo.service"
import { commonSeoSchema } from "@/app/admin/seo/_schemas/seo.schema"

// GET /api/seo — return global / common SEO configuration
export async function GET() {
  const seo = await getCommonSeo()
  return NextResponse.json(seo)
}

// PUT /api/seo — update global / common SEO configuration
export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const parsed = commonSeoSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid SEO data" },
        { status: 400 }
      )
    }
    const updated = await updateCommonSeo(parsed.data)
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: "Failed to update SEO settings" }, { status: 500 })
  }
}
