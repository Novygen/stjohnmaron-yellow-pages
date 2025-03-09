import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import MembershipRequest from "@/models/MembershipRequest";

type tParams = Promise<{ id: string }>;

export async function GET(request: Request, { params }: { params: tParams }) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Missing uid parameter" }, { status: 400 });
  }

  await dbConnect();

  // Look up the membership request by the uid stored under memberLogin.uid
  const membership = await MembershipRequest.findOne({ "memberLogin.uid": id });

  if (membership) {
    return NextResponse.json({ submitted: true });
  } else {
    return NextResponse.json({ submitted: false });
  }
}
