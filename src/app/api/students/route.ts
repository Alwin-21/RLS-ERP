import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const standard = searchParams.get("standard");
  const division = searchParams.get("division");
  const students = await prisma.student.findMany({
    where: {
      ...(standard ? { standard } : {}),
      ...(division ? { division } : {}),
    },
    orderBy: { rollNo: "asc" },
  });
  return NextResponse.json(students);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const student = await prisma.student.create({
    data: {
      rollNo:      body.rollNo,
      fullName:    body.fullName,
      standard:    body.standard,
      division:    body.division,
      gender:      body.gender,
      dob:         new Date(body.dob),
      parentName:  body.parentName,
      parentPhone: body.parentPhone,
      address:     body.address || null,
    },
  });
  return NextResponse.json(student, { status: 201 });
}
