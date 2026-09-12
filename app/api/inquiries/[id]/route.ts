import { NextResponse } from "next/server"
import {
  getInquiryById,
  updateInquiryStatus,
  deleteInquiry,
} from "@/app/admin/inquiries/_services/inquiry.service"
import { inquirySchema } from "@/app/admin/inquiries/_schemas/inquiry.schema"

type Props = { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Props) {
  const { id } = await params
  const inquiry = await getInquiryById(id)
  if (!inquiry) {
    return NextResponse.json({ error: "Inquiry not found" }, { status: 404 })
  }
  return NextResponse.json(inquiry)
}

export async function PUT(req: Request, { params }: Props) {
  try {
    const { id } = await params
    const body = await req.json()
    const parsed = inquirySchema.partial().safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid update data" },
        { status: 400 }
      )
    }
    if (parsed.data.status) {
      const updated = await updateInquiryStatus(id, parsed.data.status)
      if (!updated) {
        return NextResponse.json({ error: "Inquiry not found" }, { status: 404 })
      }
      return NextResponse.json(updated)
    }
    const inquiry = await getInquiryById(id)
    return NextResponse.json(inquiry)
  } catch {
    return NextResponse.json({ error: "Failed to update inquiry" }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: Props) {
  const { id } = await params
  const deleted = await deleteInquiry(id)
  if (!deleted) {
    return NextResponse.json({ error: "Inquiry not found" }, { status: 404 })
  }
  return NextResponse.json({ success: true })
}
