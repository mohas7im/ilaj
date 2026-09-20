import { NextResponse } from "next/server"
import {
  getWhyChooseUsItems,
  createWhyChooseUsItem,
} from "@/server/services/why-choose-us.service"
import { whyChooseUsItemSchema } from "@/app/admin/why-choose-us/_schemas/why-choose-us.schema"

export async function GET() {
  try {
    const items = await getWhyChooseUsItems()
    return NextResponse.json(items)
  } catch (error) {
    console.error("GET /api/why-choose-us error:", error)
    return NextResponse.json(
      { error: "Failed to fetch Why Choose Us items" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
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
    console.error("POST /api/why-choose-us error:", error)
    return NextResponse.json(
      { error: "Failed to create Why Choose Us item" },
      { status: 500 }
    )
  }
}
