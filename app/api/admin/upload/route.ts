import { NextResponse } from "next/server"
import { saveUploadedFile } from "@/server/lib/storage"
import { requireAdmin } from "@/lib/auth/require-admin"

export async function POST(req: Request) {
  const denied = await requireAdmin()
  if (denied) return denied

  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    const folder = (formData.get("folder") as string) || "general"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const publicUrl = await saveUploadedFile(file, folder)

    return NextResponse.json({
      success: true,
      url: publicUrl,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to upload image"
    console.error("Upload error:", error)
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
