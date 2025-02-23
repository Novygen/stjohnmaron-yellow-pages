// app/api/members/onboarding-status/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Member from "@/models/Member";
import { verifyToken } from "@/lib/auth";

export async function GET(request: Request) {
  await dbConnect();
  const verification = verifyToken(request);
  if (verification instanceof NextResponse) {
    return verification;
  }
  const decoded = verification as { memberId: string };
  const member = await Member.findById(decoded.memberId)
    .populate("personal_details")
    .populate("demographic_information")
    .populate("contact_information")
    .populate("church_membership")
    .populate("volunteer_involvement")
    .populate("professional_info")
    .populate("social_presence")
    .populate("additional_interests")
    .populate("privacy_consent")
    .populate("member_meta_data");
  if (!member) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }
  // Determine which required sub-document is missing (order as defined in your diagrams)
  const requiredFields = [
    { field: "personal_details", label: "PersonalDetails" },
    { field: "demographic_information", label: "DemographicInformation" },
    { field: "contact_information", label: "ContactInformation" },
    { field: "church_membership", label: "ChurchMembership" },
    { field: "volunteer_involvement", label: "VolunteerInvolvement" },
    { field: "professional_info", label: "ProfessionalInfo" },
    { field: "social_presence", label: "SocialPresence" },
    { field: "additional_interests", label: "AdditionalInterests" },
    { field: "privacy_consent", label: "PrivacyConsent" },
  ];
  let currentStep = "";
  for (const reqField of requiredFields) {
    if (!member[reqField.field]) {
      currentStep = reqField.label;
      break;
    }
  }
  const completed = currentStep === "";
  return NextResponse.json({ completed, currentStep });
}
