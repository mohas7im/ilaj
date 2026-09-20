import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

const SEED_INQUIRIES = [
  {
    fullName: "Zara Khan",
    email: "zara.khan@email.com",
    phone: "+92-300-1111111",
    treatment: "Dental Implants",
    preferredDate: "2026-09-25",
    preferredTime: "10:00 AM - 11:00 AM",
    message: "Hello, I would like to know the cost of dental implants and whether you offer installment plans. I need to replace two missing lower molars.",
    status: "new",
  },
  {
    fullName: "Ahmed Siddiqui",
    email: "ahmed.s@email.com",
    phone: "+92-321-2222222",
    treatment: "General Dental Checkup",
    preferredDate: "2026-09-28",
    preferredTime: "02:00 PM - 03:00 PM",
    message: "I am looking for a general dental checkup this week. Please let me know if this slot is available.",
    status: "contacted",
  },
  {
    fullName: "Fatima Iqbal",
    email: "fatima.iqbal@email.com",
    phone: "+92-333-4567890",
    treatment: "Orthodontic Braces",
    preferredDate: "2026-09-30",
    preferredTime: "04:00 PM - 05:00 PM",
    message: "My 12-year-old daughter needs braces consultation. Could you please tell me about ceramic vs metallic options?",
    status: "new",
  },
  {
    fullName: "Usman Ali",
    email: "usman.ali@email.com",
    phone: "+92-333-3333333",
    treatment: "Teeth Cleaning & Whitening",
    preferredDate: "2026-09-24",
    preferredTime: "11:00 AM - 12:00 PM",
    message: "I am interested in laser teeth whitening. How many sessions are typically required for stained teeth?",
    status: "resolved",
  },
  {
    fullName: "Nadia Rehman",
    email: "nadia.r@email.com",
    phone: "+92-345-4444444",
    treatment: "Root Canal Treatment",
    preferredDate: "2026-09-23",
    preferredTime: "03:00 PM - 04:00 PM",
    message: "Severe tooth pain on the upper right side. Need examination as soon as possible.",
    status: "new",
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "10", 10)));
    const search = searchParams.get("search")?.trim() || "";
    const treatment = searchParams.get("treatment")?.trim() || "";
    const from = searchParams.get("from")?.trim() || "";
    const to = searchParams.get("to")?.trim() || "";

    // Self-seed initial records if table is completely empty
    const totalCountInDb = await prisma.inquiry.count();
    if (totalCountInDb === 0) {
      await prisma.inquiry.createMany({ data: SEED_INQUIRIES });
    }

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

    const fullName = body.fullName || body.name;
    const email = body.email;
    const treatment = body.treatment || "General Dental Checkup";
    const message = body.message;

    if (!fullName || !email || !message) {
      return NextResponse.json(
        { error: "Full name, email, and message are required." },
        { status: 400 }
      );
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        fullName: String(fullName).trim(),
        email: String(email).trim().toLowerCase(),
        phone: body.phone ? String(body.phone).trim() : null,
        treatment: String(treatment).trim(),
        preferredDate: body.preferredDate ? String(body.preferredDate).trim() : null,
        preferredTime: body.preferredTime ? String(body.preferredTime).trim() : null,
        message: String(message).trim(),
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
