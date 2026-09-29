import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const logs = await prisma.noonMealLog.findMany({ orderBy: { logDate: "desc" } });
  return NextResponse.json(logs);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const log = await prisma.noonMealLog.create({
    data: {
      logDate:            new Date(body.logDate),
      headcountServed:    parseInt(body.headcountServed),
      riceUsedKg:         parseFloat(body.riceUsedKg),
      dalUsedKg:          parseFloat(body.dalUsedKg),
      vegetablesUsedKg:   parseFloat(body.vegetablesUsedKg),
      oilUsedLiters:      parseFloat(body.oilUsedLiters),
      eggCount:           parseInt(body.eggCount) || 0,
      qualityCheckPassed: body.qualityCheckPassed !== false,
      cookInCharge:       body.cookInCharge || "Mrs. S. Lakshmi",
      notes:              body.notes || null,
    },
  });
  return NextResponse.json(log, { status: 201 });
}
