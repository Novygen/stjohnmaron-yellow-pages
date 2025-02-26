import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import { Industry } from "@/models/Industry";
import industriesData from "@/data/industries.json";

export async function GET() {
  await dbConnect();

  // Check if any industries exist in the database.
  const count = await Industry.countDocuments();
  if (count === 0) {
    // If empty, populate with data from the JSON file.
    await Industry.insertMany(industriesData);
  }

  // Return the list of industries.
  const industries = await Industry.find();
  return NextResponse.json(industries);
}
