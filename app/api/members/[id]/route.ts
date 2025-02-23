/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/members/[id]/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Member from "@/models/Member";
import mongoose from "mongoose";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id } = params;

  // First, try to find a member by its own _id.
  let member = await Member.findById(id)
    .populate("personal_details")
    .populate("member_meta_data")
    .populate("contact_information");

  // If not found, check for a query parameter "by"
  const { searchParams } = new URL(request.url);
  const by = searchParams.get("by");

  if (!member && by) {
    const query: any = {};
    try {
      query[by] = new mongoose.Types.ObjectId(id);
      member = await Member.findOne(query)
        .populate("personal_details")
        .populate("member_meta_data")
        .populate("contact_information");
    } catch (err) {
      // if invalid ObjectId, ignore
    }
  }

  // If still not found, iterate over known sub-document fields:
  if (!member) {
    const fields = [
      "personal_details",
      "demographic_information",
      "contact_information",
      "church_membership",
      "volunteer_involvement",
      "professional_info",
      "social_presence",
      "additional_interests",
      "privacy_consent",
    ];
    for (const field of fields) {
      const query: any = {};
      try {
        query[field] = new mongoose.Types.ObjectId(id);
      } catch (err) {
        continue;
      }
      member = await Member.findOne(query)
        .populate("personal_details")
        .populate("member_meta_data")
        .populate("contact_information");
      if (member) break;
    }
  }

  if (!member) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }
  return NextResponse.json(member);
}