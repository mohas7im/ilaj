import { NextResponse } from "next/server"
import { getPageSeo, updatePageSeo } from "@/app/admin/seo/_services/seo.service"
import { pageSeoSchema } from "@/app/admin/seo/_schemas/seo.schema"

type Params = { params: Promise<{ page: string }> }

// GET /api/seo/:page — return SEO data for a specific page
export async function GET(_req: Request, { params }: Params) {
  const { page } = await params
  const seo = await getPageSeo(page)
  return NextResponse.json(seo)
}

// PUT /api/seo/:page — update SEO data for a specific page
export async function PUT(req: Request, { params }: Params) {
  try {
    const { page } = await params
    const body = await req.json()
    const parsed = pageSeoSchema.safeParse({ ...body, page })
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid page SEO data" },
        { status: 400 }
      )
    }
    const updated = await updatePageSeo(page, parsed.data)
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: "Failed to update page SEO" }, { status: 500 })
  }
}
