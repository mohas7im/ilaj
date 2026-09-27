import { NextResponse } from "next/server"
import { getFaqs, createFaq, isValidFaqService } from "@/server/services/faq.service"
import { faqSchema } from "@/domain/faq/faq.schema"
import { requireAdmin } from "@/lib/auth/require-admin"

export async function GET() {
  const denied = await requireAdmin()
  if (denied) return denied

  try {
    const faqs = await getFaqs()
    return NextResponse.json(faqs)
  } catch (error) {
    console.error("GET /api/admin/faqs error:", error)
    return NextResponse.json({ error: "Failed to fetch FAQs" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const denied = await requireAdmin()
  if (denied) return denied

  try {
    const body = await req.json()
    const parsed = faqSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
    }
    if (!(await isValidFaqService(parsed.data.serviceId))) {
      return NextResponse.json({ error: "Selected treatment does not exist" }, { status: 400 })
    }
    const created = await createFaq(parsed.data)
    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    console.error("POST /api/admin/faqs error:", error)
    return NextResponse.json({ error: "Failed to create FAQ" }, { status: 500 })
  }
}
