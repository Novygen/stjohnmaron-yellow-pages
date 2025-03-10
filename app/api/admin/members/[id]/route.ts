import { NextResponse } from "next/server";
import Member from "@/models/Member";
import dbConnect from "@/lib/dbConnect";

type tParams = Promise<{ id: string }>;

async function getHandler(
  request: Request,
  { params }: { params: tParams }
) {
  await dbConnect();
  const memberId = (await params).id;
  const member = await Member.findById(memberId);
  
  if (!member) {
    return NextResponse.json(
      { error: "Member not found" },
      { status: 404 }
    );
  }
  
  return NextResponse.json(member);
}

async function patchHandler(
  request: Request,
  { params }: { params: tParams }
) {
  await dbConnect();
  const memberId = (await params).id;
  const data = await request.json();
  
  const member = await Member.findByIdAndUpdate(
    memberId,
    {
      ...data,
      lastUpdated: new Date()
    },
    { new: true }
  );
  
  if (!member) {
    return NextResponse.json(
      { error: "Member not found" },
      { status: 404 }
    );
  }
  
  return NextResponse.json(member);
}

async function deleteHandler(
  request: Request,
  { params }: { params: tParams }
) {
  await dbConnect();
  const memberId = (await params).id;
  
  const member = await Member.findByIdAndUpdate(
    memberId,
    {
      status: 'inactive',
      lastUpdated: new Date()
    },
    { new: true }
  );
  
  if (!member) {
    return NextResponse.json(
      { error: "Member not found" },
      { status: 404 }
    );
  }
  
  return NextResponse.json({ message: "Member deactivated" });
}

export const GET = async (
  request: Request,
  context: { params: tParams }
) => getHandler(request, context);

export const PATCH = async (
  request: Request,
  context: { params: tParams }
) => patchHandler(request, context);

export const DELETE = async (
  request: Request,
  context: { params: tParams }
) => deleteHandler(request, context); 