import { NextResponse } from "next/server"
import {
  getFaqById,
  updateFaq,
  deleteFaq,
} from "@/server/services/faq.service"
import { faqSchema } from "@/domain/faq/faq.schema"
import { requireAdmin } from "@/lib/auth/require-admin"

type Props = { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Props) {
  const denied = await requireAdmin()
  if (denied) return denied

  try {
    const { id } = await params
    const faq = await getFaqById(id)
    if (!faq) {
      return NextResponse.json({ error: "FAQ not found" }, { status: 404 })
    }
    return NextResponse.json(faq)
  } catch (error) {
    console.error("GET /api/admin/faqs/[id] error:", error)
    return NextResponse.json({ error: "Failed to fetch FAQ" }, { status: 500 })
  }
}

// Full update: the form always sends every field.
export async function PUT(req: Request, { params }: Props) {
  const denied = await requireAdmin()
  if (denied) return denied

  try {
    const { id } = await params
    const body = await req.json()
    const parsed = faqSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
    }
    const updated = await updateFaq(id, parsed.data)
    if (!updated) {
      return NextResponse.json({ error: "FAQ not found" }, { status: 404 })
    }
    return NextResponse.json(updated)
  } catch (error) {
    console.error("PUT /api/admin/faqs/[id] error:", error)
    return NextResponse.json({ error: "Failed to update FAQ" }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: Props) {
  const denied = await requireAdmin()
  if (denied) return denied

  try {
    const { id } = await params
    const deleted = await deleteFaq(id)
    if (!deleted) {
      return NextResponse.json({ error: "FAQ not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/admin/faqs/[id] error:", error)
    return NextResponse.json({ error: "Failed to delete FAQ" }, { status: 500 })
  }
}
