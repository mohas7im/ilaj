import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "10", 10)));
    const search = searchParams.get("search")?.trim() || "";
    const treatment = searchParams.get("treatment")?.trim() || "";
    const from = searchParams.get("from")?.trim() || "";
    const to = searchParams.get("to")?.trim() || "";

    // Build dynamic Prisma filter
    const where: Prisma.InquiryWhereInput = {};

    if (treatment && treatment !== "all") {
      where.treatment = { equals: treatment, mode: "insensitive" };
    }

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { message: { contains: search, mode: "insensitive" } },
      ];
    }

    if (from || to) {
      where.createdAt = {};
      if (from) {
        const fromDate = new Date(from);
        if (!isNaN(fromDate.getTime())) {
          fromDate.setHours(0, 0, 0, 0);
          where.createdAt.gte = fromDate;
        }
      }
      if (to) {
        const toDate = new Date(to);
        if (!isNaN(toDate.getTime())) {
          toDate.setHours(23, 59, 59, 999);
          where.createdAt.lte = toDate;
        }
      }
    }

    const total = await prisma.inquiry.count({ where });
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const skip = (page - 1) * limit;

    const inquiries = await prisma.inquiry.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      inquiries,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Failed to fetch inquiries:", error);
    return NextResponse.json(
      { error: "Failed to fetch inquiries" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const fullName = body.fullName?.trim();
    const email = body.email?.trim()?.toLowerCase();
    const treatment = body.treatment?.trim();
    const message = body.message?.trim();
    const phone = body.phone?.trim() || null;
    const preferredDate = body.preferredDate?.trim() || null;
    const preferredTime = body.preferredTime?.trim() || null;

    if (!fullName) {
      return NextResponse.json({ error: "Full name is required." }, { status: 400 });
    }
    if (!email) {
      return NextResponse.json({ error: "Email address is required." }, { status: 400 });
    }
    if (!treatment) {
      return NextResponse.json({ error: "Treatment selection is required." }, { status: 400 });
    }
    if (!message) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        fullName,
        email,
        phone,
        treatment,
        preferredDate,
        preferredTime,
        message,
        status: body.status || "new",
      },
    });

    return NextResponse.json(inquiry, { status: 201 });
  } catch (error) {
    console.error("Failed to create inquiry:", error);
    return NextResponse.json(
      { error: "Failed to submit contact inquiry" },
      { status: 500 }
    );
  }
}
