import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const works = await prisma.historicalWork.findMany({ orderBy: { year: "desc" } });
  return NextResponse.json(works);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const work = await prisma.historicalWork.create({
    data: {
      title:           body.title,
      contributorType: body.contributorType,
      institutionName: body.institutionName,
      year:            parseInt(body.year),
      description:     body.description,
      projectUrl:      body.projectUrl || null,
    },
  });
  return NextResponse.json(work, { status: 201 });
}
