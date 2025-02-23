/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/members/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Member from "@/models/Member";

export async function GET(request: Request) {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const sortField = searchParams.get("sort") || "personal_details.first_name";
  const order = searchParams.get("order") === "desc" ? -1 : 1;

  // Build an aggregation pipeline to join the sub-documents:
  const pipeline: any[] = [
    // Lookup personal_details
    {
      $lookup: {
        from: "personaldetails",
        localField: "personal_details",
        foreignField: "_id",
        as: "personal_details",
      },
    },
    { $unwind: { path: "$personal_details", preserveNullAndEmptyArrays: true } },
    // Lookup member_meta_data
    {
      $lookup: {
        from: "membermetadatas",
        localField: "member_meta_data",
        foreignField: "_id",
        as: "member_meta_data",
      },
    },
    { $unwind: { path: "$member_meta_data", preserveNullAndEmptyArrays: true } },
    // Lookup contact_information
    {
      $lookup: {
        from: "contactinformations",
        localField: "contact_information",
        foreignField: "_id",
        as: "contact_information",
      },
    },
    { $unwind: { path: "$contact_information", preserveNullAndEmptyArrays: true } },
  ];

  // If a search string is provided, match on first_name or last_name (case‑insensitive)
  if (search) {
    pipeline.push({
      $match: {
        $or: [
          { "personal_details.first_name": { $regex: search, $options: "i" } },
          { "personal_details.last_name": { $regex: search, $options: "i" } },
        ],
      },
    });
  }

  // Sorting stage:
  pipeline.push({
    $sort: {
      [sortField]: order,
    },
  });

  // Only project the desired fields:
  pipeline.push({
    $project: {
      personal_details: 1,
      member_meta_data: 1,
      contact_information: 1,
    },
  });

  const results = await Member.aggregate(pipeline);
  return NextResponse.json(results);
}
