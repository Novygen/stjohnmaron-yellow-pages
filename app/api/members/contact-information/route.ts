/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/members/contact-information/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import ContactInformation from "@/models/ContactInformation";
import Address from "@/models/Address";
import { verifyToken } from "@/lib/auth";

// GET endpoints: populate address field
export async function GET(request: Request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (id) {
    const record = await ContactInformation.findById(id).populate("address");
    return NextResponse.json(record);
  }
  const records = await ContactInformation.find().populate("address");
  return NextResponse.json(records);
}

export async function POST(request: Request) {
  await dbConnect();
  const verification = verifyToken(request);
  if (verification instanceof NextResponse) return verification;
  try {
    const body = await request.json();
    // Extract address and create Address document first
    const { address, ...rest } = body;
    const newAddress = await Address.create(address);
    const record = await ContactInformation.create({ ...rest, address: newAddress._id });
    // Populate address before returning
    const populated = await record.populate("address");
    return NextResponse.json(populated, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  await dbConnect();
  const verification = verifyToken(request);
  if (verification instanceof NextResponse) return verification;
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const body = await request.json();
    const { address, ...rest } = body;
    // Retrieve the existing record to get the address reference
    const record = await ContactInformation.findById(id);
    if (!record) return NextResponse.json({ error: "Record not found" }, { status: 404 });
    // Update the ContactInformation's fields
    record.set(rest);
    // If address is provided, update the Address sub-document
    if (address) {
      await Address.findByIdAndUpdate(record.address, address, { new: true });
    }
    const updated = await record.save();
    const populated = await updated.populate("address");
    return NextResponse.json(populated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  await dbConnect();
  const verification = verifyToken(request);
  if (verification instanceof NextResponse) return verification;
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    // Retrieve the record to get associated Address id
    const record = await ContactInformation.findById(id);
    if (record && record.address) {
      await Address.findByIdAndDelete(record.address);
    }
    await ContactInformation.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
