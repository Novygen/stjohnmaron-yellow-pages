import { NextResponse } from "next/server";
import Member from "@/models/Member";
import dbConnect from "@/lib/dbConnect";

type EmptyParams = Record<string, never>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getHandler(_request: Request, _context: { params: EmptyParams }) {
  await dbConnect();
  const members = await Member.find({}).sort({ lastUpdated: -1 });
  return NextResponse.json(members);
}

async function postHandler(request: Request, 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _context: { params: EmptyParams }) {
  await dbConnect();
  const data = await request.json();
  const member = new Member(data);
  await member.save();
  return NextResponse.json(member);
}

export const GET = async (
  request: Request,
  context: { params: EmptyParams }
) => getHandler(request, context);

export const POST = async (
  request: Request,
  context: { params: EmptyParams }
) => postHandler(request, context); 