import { NextResponse } from "next/server"
import {
  getWhyChooseUsItems,
  createWhyChooseUsItem,
} from "@/server/services/why-choose-us.service"
import { whyChooseUsItemSchema } from "@/domain/why-choose-us/why-choose-us.schema"
import { requireAdmin } from "@/lib/auth/require-admin"

export async function GET() {
  const denied = await requireAdmin()
  if (denied) return denied

  try {
    const items = await getWhyChooseUsItems()
    return NextResponse.json(items)
  } catch (error) {
    console.error("GET /api/admin/why-choose-us error:", error)
    return NextResponse.json(
      { error: "Failed to fetch Why Choose Us items" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  const denied = await requireAdmin()
  if (denied) return denied

  try {
    const body = await req.json()
    const parsed = whyChooseUsItemSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }
    const created = await createWhyChooseUsItem(parsed.data)
    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    console.error("POST /api/admin/why-choose-us error:", error)
    return NextResponse.json(
      { error: "Failed to create Why Choose Us item" },
      { status: 500 }
    )
  }
}
