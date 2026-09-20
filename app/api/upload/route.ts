import { NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import crypto from "crypto"
import { v2 as cloudinary } from "cloudinary"

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
])

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024 // 10MB

function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_URL ||
      (process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET)
  )
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    const folder = (formData.get("folder") as string) || "general"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          error:
            "Invalid file type. Only JPEG, PNG, WebP, GIF, and SVG images are allowed.",
        },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "File size exceeds the 10MB limit." },
        { status: 400 }
      )
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Check if Cloudinary credentials are provided (typically in production)
    if (isCloudinaryConfigured()) {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      })

      const uploadResult = await new Promise<{ secure_url: string }>(
        (resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: `ilaj/${folder}`,
              resource_type: "image",
            },
            (error, result) => {
              if (error || !result) {
                reject(error || new Error("Cloudinary upload failed"))
              } else {
                resolve(result)
              }
            }
          )
          uploadStream.end(buffer)
        }
      )

      return NextResponse.json({
        success: true,
        url: uploadResult.secure_url,
      })
    }

    // Default development mode: save to public/uploads directory
    const uploadsDir = path.join(process.cwd(), "public", "uploads")
    await mkdir(uploadsDir, { recursive: true })

    const ext = path.extname(file.name) || ".jpg"
    const safeBase = path
      .basename(file.name, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "")
      .slice(0, 30)
    const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}`
    const fileName = `${safeBase ? `${safeBase}-` : ""}${uniqueSuffix}${ext.toLowerCase()}`
    const filePath = path.join(uploadsDir, fileName)

    await writeFile(filePath, buffer)

    const publicUrl = `/uploads/${fileName}`

    return NextResponse.json({
      success: true,
      url: publicUrl,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: "Failed to upload image. Please try again." },
      { status: 500 }
    )
  }
}
