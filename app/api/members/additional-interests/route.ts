/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/members/additional-interests/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import AdditionalInterests from "@/models/AdditionalInterests";
import { verifyToken } from "@/lib/auth";

export async function GET(request: Request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (id) {
    const record = await AdditionalInterests.findById(id);
    return NextResponse.json(record);
  }
  const records = await AdditionalInterests.find();
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
    const record = await AdditionalInterests.create(body);
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
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const body = await request.json();
    const updated = await AdditionalInterests.findByIdAndUpdate(id, body, { new: true });
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
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    await AdditionalInterests.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
