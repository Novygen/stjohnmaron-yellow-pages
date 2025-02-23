/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/personal-details/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import PersonalDetails from "@/models/PersonalDetails";
import { verifyToken } from "@/lib/auth";

export async function GET(request: Request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const memberId = searchParams.get("id");
  console.log("Personal Details - Member ID: ", memberId);
  if (memberId) {
    const record = await PersonalDetails.findOne({ memberId });
    console.log("Personal Details: ", record);
    return NextResponse.json(record);
  }
  const records = await PersonalDetails.find();
  return NextResponse.json(records);
}

export async function POST(request: Request) {
  await dbConnect();
  const verification = verifyToken(request);
  if (verification instanceof NextResponse) {
    return verification;
  }
  try {
    const body = await request.json();
    const record = await PersonalDetails.create(body);
    return NextResponse.json(record, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  await dbConnect();
  const verification = verifyToken(request);
  if (verification instanceof NextResponse) {
    return verification;
  }
  try {
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get("id");
    if (!memberId) {
      return NextResponse.json({ error: "Missing memberId" }, { status: 400 });
    }
    const body = await request.json();
    const updated = await PersonalDetails.findOneAndUpdate(
      { memberId },
      body,
      { new: true }
    );
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  await dbConnect();
  const verification = verifyToken(request);
  if (verification instanceof NextResponse) {
    return verification;
  }
  try {
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get("id");
    if (!memberId) {
      return NextResponse.json({ error: "Missing memberId" }, { status: 400 });
    }
    await PersonalDetails.findOneAndDelete({ memberId });
    return NextResponse.json({ message: "Deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
