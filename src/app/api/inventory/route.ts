import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const [books, sports, history, visitors] = await Promise.all([
    prisma.libraryRecord.findMany({ orderBy: { accessionNo: "asc" }, include: { borrower: { select: { fullName: true, rollNo: true } } } }),
    prisma.sportsInventory.findMany({ orderBy: { itemCode: "asc" } }),
    prisma.historicalWork.findMany({ orderBy: { year: "desc" } }),
    prisma.visitorLog.findMany({ orderBy: { visitDate: "desc" } }),
  ]);
  return NextResponse.json({ books, sports, history, visitors });
}
