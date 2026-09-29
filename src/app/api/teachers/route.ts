import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const teachers = await prisma.teacher.findMany({ orderBy: { teacherCode: "asc" } });
  return NextResponse.json(teachers);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const basic = parseFloat(body.basicSalary) || 35000;
  const teacher = await prisma.teacher.create({
    data: {
      teacherCode:     body.teacherCode,
      fullName:        body.fullName,
      email:           body.email,
      phone:           body.phone,
      qualification:   body.qualification,
      designation:     body.designation,
      assignedSubject: body.assignedSubject,
      classTeacherFor: body.classTeacherFor || null,
      basicSalary:     basic,
      pfDeduction:     Math.round(basic * 0.12),
      allowances:      parseFloat(body.allowances) || 5000,
      joiningDate:     new Date(body.joiningDate),
    },
  });
  return NextResponse.json(teacher, { status: 201 });
}
