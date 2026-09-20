import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Props) {
  try {
    const { id } = await params;
    const inquiry = await prisma.inquiry.findUnique({
      where: { id },
    });

    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    return NextResponse.json(inquiry);
  } catch (error) {
    console.error("GET /api/inquiries/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch inquiry" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: Props) {
  try {
    const { id } = await params;
    const body = await req.json();

    const dataToUpdate: Record<string, any> = {};
    if (body.status !== undefined) dataToUpdate.status = String(body.status);
    if (body.message !== undefined) dataToUpdate.message = String(body.message);
    if (body.treatment !== undefined) dataToUpdate.treatment = String(body.treatment);
    if (body.phone !== undefined) dataToUpdate.phone = body.phone ? String(body.phone) : null;
    if (body.preferredDate !== undefined) dataToUpdate.preferredDate = body.preferredDate ? String(body.preferredDate) : null;
    if (body.preferredTime !== undefined) dataToUpdate.preferredTime = body.preferredTime ? String(body.preferredTime) : null;

    const updated = await prisma.inquiry.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/inquiries/[id] error:", error);
    return NextResponse.json({ error: "Failed to update inquiry" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Props) {
  try {
    const { id } = await params;
    await prisma.inquiry.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/inquiries/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete inquiry" }, { status: 500 });
  }
}
