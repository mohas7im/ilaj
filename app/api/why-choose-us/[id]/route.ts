import { NextResponse } from "next/server"
import {
  getWhyChooseUsItemById,
  updateWhyChooseUsItem,
  deleteWhyChooseUsItem,
} from "@/server/services/why-choose-us.service"
import { whyChooseUsItemSchema } from "@/app/admin/why-choose-us/_schemas/why-choose-us.schema"

type Props = { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Props) {
  try {
    const { id } = await params
    const item = await getWhyChooseUsItemById(id)
    if (!item) {
      return NextResponse.json({ error: "Why Choose Us item not found" }, { status: 404 })
    }
    return NextResponse.json(item)
  } catch (error) {
    console.error("GET /api/why-choose-us/[id] error:", error)
    return NextResponse.json({ error: "Failed to fetch item" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: Props) {
  try {
    const { id } = await params
    const body = await req.json()
    const parsed = whyChooseUsItemSchema.partial().safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }
    const updated = await updateWhyChooseUsItem(id, parsed.data)
    if (!updated) {
      return NextResponse.json({ error: "Why Choose Us item not found" }, { status: 404 })
    }
    return NextResponse.json(updated)
  } catch (error) {
    console.error("PUT /api/why-choose-us/[id] error:", error)
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: Props) {
  try {
    const { id } = await params
    const deleted = await deleteWhyChooseUsItem(id)
    if (!deleted) {
      return NextResponse.json({ error: "Why Choose Us item not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/why-choose-us/[id] error:", error)
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 })
  }
}
