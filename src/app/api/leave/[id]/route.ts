import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const leave = await prisma.leaveRequest.update({
    where: { id },
    data: {
      status:      body.status,
      approvedBy:  body.approvedBy || null,
      reviewNotes: body.reviewNotes || null,
    },
  });
  return NextResponse.json(leave);
}
