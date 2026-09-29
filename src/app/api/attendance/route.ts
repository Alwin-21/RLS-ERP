import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Staff Attendance
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const d = date ? new Date(date) : new Date();
  d.setHours(0,0,0,0);
  const next = new Date(d);
  next.setDate(next.getDate() + 1);

  const records = await prisma.staffAttendance.findMany({
    where: { attendanceDate: { gte: d, lt: next } },
    include: { teacher: { select: { fullName: true, teacherCode: true } } },
  });
  return NextResponse.json(records);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  // body: { records: [{ teacherId, status, checkInTime, notes }], date }
  const date = new Date(body.date || new Date());
  date.setHours(0,0,0,0);

  const ops = (body.records as any[]).map((r) =>
    prisma.staffAttendance.upsert({
      where: {
        teacherId_attendanceDate: {
          teacherId: r.teacherId,
          attendanceDate: date,
        },
      },
      create: {
        teacherId:      r.teacherId,
        attendanceDate: date,
        status:         r.status || "present",
        checkInTime:    r.checkInTime || null,
        notes:          r.notes || null,
      },
      update: {
        status:      r.status || "present",
        checkInTime: r.checkInTime || null,
        notes:       r.notes || null,
      },
    })
  );
  const results = await prisma.$transaction(ops);
  return NextResponse.json(results, { status: 201 });
}
