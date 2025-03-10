import { NextResponse } from "next/server";
import { withAdminApiAuth } from "@/utils/withAdminApiAuth";
import Member from "@/models/Member";
import dbConnect from "@/lib/dbConnect";
import { ApiContext } from "@/app/utils/withAdminApiAuth";

async function getHandler(
  request: Request,
  context: ApiContext
) {
  await dbConnect();
  const params = await context.params;
  const member = await Member.findById(params.id);
  
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
  context: ApiContext
) {
  await dbConnect();
  const params = await context.params;
  const data = await request.json();
  
  const member = await Member.findByIdAndUpdate(
    params.id,
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
  context: ApiContext
) {
  await dbConnect();
  const params = await context.params;
  
  const member = await Member.findByIdAndUpdate(
    params.id,
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