import { NextResponse } from "next/server";
import { withAdminApiAuth } from "@/app/utils/withAdminApiAuth";
import Member from "@/models/Member";
import dbConnect from "@/lib/dbConnect";

async function getHandler() {
  await dbConnect();
  const members = await Member.find({}).sort({ lastUpdated: -1 });
  return NextResponse.json(members);
}

async function postHandler(request: Request) {
  await dbConnect();
  const data = await request.json();
  const member = new Member(data);
  await member.save();
  return NextResponse.json(member);
}

export const GET = withAdminApiAuth(getHandler);
export const POST = withAdminApiAuth(postHandler); 