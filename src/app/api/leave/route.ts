import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const leaves = await prisma.leaveRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: { teacher: { select: { fullName: true } } },
  });
  return NextResponse.json(leaves);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const teacher = await prisma.teacher.findUnique({ where: { id: body.teacherId } });
  const leave = await prisma.leaveRequest.create({
    data: {
      teacherId:   body.teacherId,
      teacherName: teacher?.fullName || body.teacherName,
      leaveType:   body.leaveType,
      startDate:   new Date(body.startDate),
      endDate:     new Date(body.endDate),
      totalDays:   parseInt(body.totalDays),
      reason:      body.reason,
    },
  });
  return NextResponse.json(leave, { status: 201 });
}
