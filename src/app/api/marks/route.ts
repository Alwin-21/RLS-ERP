import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const studentId  = searchParams.get("studentId");
  const standard   = searchParams.get("standard");
  const division   = searchParams.get("division");
  const subject    = searchParams.get("subject");
  const examType   = searchParams.get("examType");

  const marks = await prisma.markRegister.findMany({
    where: {
      ...(studentId ? { studentId } : {}),
      ...(subject   ? { subjectName: subject } : {}),
      ...(examType  ? { examType } : {}),
      ...(standard || division
        ? { student: { ...(standard ? { standard } : {}), ...(division ? { division } : {}) } }
        : {}),
    },
    include: { student: { select: { fullName: true, rollNo: true } } },
    orderBy: { examDate: "desc" },
  });
  return NextResponse.json(marks);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const mark = await prisma.markRegister.create({
    data: {
      studentId:     body.studentId,
      subjectName:   body.subjectName,
      examType:      body.examType,
      marksObtained: parseFloat(body.marksObtained),
      maxMarks:      parseFloat(body.maxMarks) || 100,
      examDate:      new Date(body.examDate),
      remarks:       body.remarks || null,
    },
  });
  return NextResponse.json(mark, { status: 201 });
}
