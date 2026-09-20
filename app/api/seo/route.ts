import { NextResponse } from "next/server"
import { getCommonSeo, updateCommonSeo } from "@/app/admin/seo/_services/seo.service"
import { commonSeoSchema } from "@/app/admin/seo/_schemas/seo.schema"
import { saveUploadedFile } from "@/server/lib/storage"

// GET /api/seo — return global / common SEO configuration
export async function GET() {
  const seo = await getCommonSeo()
  return NextResponse.json(seo)
}

// PUT /api/seo — update global / common SEO configuration
export async function PUT(req: Request) {
  try {
    let data: Record<string, any> = {}
    const contentType = req.headers.get("content-type") || ""

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData()
      const ogImageFile = formData.get("defaultOgImage")

      let ogImageUrl: string | null = null
      if (ogImageFile && typeof ogImageFile === "object" && "arrayBuffer" in ogImageFile && (ogImageFile as File).size > 0) {
        ogImageUrl = await saveUploadedFile(ogImageFile as File, "seo")
      } else if (typeof ogImageFile === "string" && ogImageFile.trim()) {
        ogImageUrl = ogImageFile
      } else if (formData.has("existingOgImage")) {
        ogImageUrl = (formData.get("existingOgImage") as string) || null
      }

      data = {
        siteName: formData.get("siteName") || "",
        siteUrl: formData.get("siteUrl") || "",
        defaultTitle: formData.get("defaultTitle") || "",
        defaultDescription: formData.get("defaultDescription") || "",
        googleVerification: formData.get("googleVerification") || "",
        bingVerification: formData.get("bingVerification") || "",
        defaultOgImage: ogImageUrl || "",
      }
    } else {
      data = await req.json()
    }

    const parsed = commonSeoSchema.safeParse(data)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid SEO data" },
        { status: 400 }
      )
    }
    const updated = await updateCommonSeo(parsed.data)
    return NextResponse.json(updated)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update SEO settings"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
