import { NextResponse } from "next/server"
import { getInquiries, createInquiry } from "@/app/admin/inquiries/_services/inquiry.service"
import { inquirySchema } from "@/app/admin/inquiries/_schemas/inquiry.schema"

export async function GET() {
  const inquiries = await getInquiries()
  return NextResponse.json(inquiries)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = inquirySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid inquiry data" },
        { status: 400 }
      )
    }
    const created = await createInquiry(parsed.data)
    return NextResponse.json(created, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create inquiry" }, { status: 500 })
  }
}
