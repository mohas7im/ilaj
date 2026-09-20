import { NextResponse } from "next/server"
import { getPageSeo, updatePageSeo } from "@/app/admin/seo/_services/seo.service"
import { pageSeoSchema } from "@/app/admin/seo/_schemas/seo.schema"
import { saveUploadedFile } from "@/server/lib/storage"

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
    let data: Record<string, any> = {}
    const contentType = req.headers.get("content-type") || ""

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData()
      const ogImageFile = formData.get("ogImage")

      let ogImageUrl: string | null = null
      if (ogImageFile && typeof ogImageFile === "object" && "arrayBuffer" in ogImageFile && (ogImageFile as File).size > 0) {
        ogImageUrl = await saveUploadedFile(ogImageFile as File, "seo")
      } else if (typeof ogImageFile === "string" && ogImageFile.trim()) {
        ogImageUrl = ogImageFile
      } else if (formData.has("existingOgImage")) {
        ogImageUrl = (formData.get("existingOgImage") as string) || null
      }

      data = {
        page,
        title: formData.get("title") || "",
        description: formData.get("description") || "",
        ogImage: ogImageUrl || "",
      }
    } else {
      const body = await req.json()
      data = { ...body, page }
    }

    const parsed = pageSeoSchema.safeParse(data)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid page SEO data" },
        { status: 400 }
      )
    }
    const updated = await updatePageSeo(page, parsed.data)
    return NextResponse.json(updated)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update page SEO"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
