// Admin uploads live on Cloudinary, and next/image serves remote URLs as-is
// (full-size originals). This asks Cloudinary for a resized copy in the best
// format the browser supports. Pick `width` ≈ the largest displayed width × 2
// for sharp phones. Non-Cloudinary sources are returned unchanged.
export function sizedImage(src: string, width: number): string {
  if (!src.startsWith("https://res.cloudinary.com/")) return src
  return src.replace("/upload/", `/upload/f_auto,q_auto,c_limit,w_${width}/`)
}
