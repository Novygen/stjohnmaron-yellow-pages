import { NextResponse } from "next/server";

const industries = [
  { id: "tech", name: "Technology" },
  { id: "healthcare", name: "Healthcare" },
  { id: "finance", name: "Finance" },
  { id: "education", name: "Education" },
  { id: "manufacturing", name: "Manufacturing" },
  { id: "retail", name: "Retail" },
  { id: "construction", name: "Construction" },
  { id: "real_estate", name: "Real Estate" },
  { id: "legal", name: "Legal Services" },
  { id: "hospitality", name: "Hospitality" },
  { id: "other", name: "Other" },
];

export async function GET() {
  return NextResponse.json(industries);
}
