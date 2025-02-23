import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import MembershipRequest from "@/models/MembershipRequest";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const propParams = await params;
  const uid = await propParams.id;
  if (!uid) {
    return NextResponse.json({ error: "Missing uid parameter" }, { status: 400 });
  }

  await dbConnect();

  // Look up the membership request by the uid stored under member_login.uid
  const membership = await MembershipRequest.findOne({ "member_login.uid": uid });

  if (membership) {
    return NextResponse.json({ submitted: true });
  } else {
    return NextResponse.json({ submitted: false });
  }
}
