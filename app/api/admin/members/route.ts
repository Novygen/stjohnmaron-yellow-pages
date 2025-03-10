import { NextResponse } from "next/server";
import Member from "@/models/Member";
import dbConnect from "@/lib/dbConnect";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getHandler(_request: Request) {
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

export const GET = getHandler;
export const POST = postHandler; 