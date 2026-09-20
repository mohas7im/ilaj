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
  return Boolean(process.env.CLOUDINARY_URL)
}

/**
 * Validates and uploads an image directly to Cloudinary.
 * Throws an error if Cloudinary credentials are not configured in .env.
 * Returns the secure public HTTPS URL from Cloudinary.
 */
export async function saveUploadedFile(file: File, folder: string = "general"): Promise<string> {
  if (!file || typeof file !== "object" || !("arrayBuffer" in file) || file.size === 0) {
    throw new Error("No valid file provided")
  }

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    throw new Error("Invalid file type. Only JPEG, PNG, WebP, GIF, and SVG images are allowed.")
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error("File size exceeds the 10MB limit.")
  }

  if (!isCloudinaryConfigured()) {
    throw new Error(
      "Cloudinary is not configured. Please add CLOUDINARY_URL to your .env file."
    )
  }

  cloudinary.config({
    cloudinary_url: process.env.CLOUDINARY_URL,
  })

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
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
  })

  return uploadResult.secure_url
}
