import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import { Specialization } from "@/models/Specialization";
import { Industry } from "@/models/Industry";
import specializationsData from "@/data/specializations.json";

export async function GET() {
  await dbConnect();

  // Check if any specializations exist.
  const count = await Specialization.countDocuments();
  if (count === 0) {
    // Populate specializations if collection is empty.
    for (const spec of specializationsData) {
      // Find the industry document by name.
      const industryDoc = await Industry.findOne({ name: spec.industry });
      if (industryDoc) {
        await Specialization.create({
          name: spec.name,
          industry: industryDoc._id,
        });
      }
    }
  }

  // Return the list of specializations.
  const specializations = await Specialization.find().populate("industry", "name");
  return NextResponse.json(specializations);
}
