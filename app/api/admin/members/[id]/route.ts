import { NextResponse } from "next/server";
import { withAdminApiAuth, RouteParams } from "@/app/utils/withAdminApiAuth";
import Member from "@/models/Member";
import dbConnect from "@/lib/dbConnect";

async function getHandler(
  request: Request,
  context: RouteParams
) {
  await dbConnect();
  const memberId = context.params.id as string;
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
  context: RouteParams
) {
  await dbConnect();
  const memberId = context.params.id as string;
  const data = await request.json();
  
  const member = await Member.findByIdAndUpdate(
    memberId,
    {
      ...data,
      lastUpdated: new Date(),
    },
    { new: true, runValidators: true }
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
  context: RouteParams
) {
  await dbConnect();
  const memberId = context.params.id as string;
  
  const member = await Member.findByIdAndUpdate(
    memberId,
    {
      status: 'inactive',
      lastUpdated: new Date(),
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

export const GET = withAdminApiAuth(getHandler);
export const PATCH = withAdminApiAuth(patchHandler);
export const DELETE = withAdminApiAuth(deleteHandler); 