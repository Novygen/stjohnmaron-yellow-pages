/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import MembershipRequest from "@/models/MembershipRequest";
import { z } from "zod";

const membershipRequestSchema = z.object({
  memberLogin: z.object({
    uid: z.string(),
  }),
  personalDetails: z.object({
    firstName: z.string(),
    lastName: z.string(),
    middleName: z.string().optional(),
    ageRange: z.string(),
    state: z.string().optional(),
  }),
  contactInformation: z.object({
    primaryPhoneNumber: z.string(),
    primaryEmail: z.string().email(),
    address: z.object({
      line1: z.string().optional(),
      line2: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zip: z.string().optional(),
      country: z.string().optional(),
    }).optional(),
  }),
  professionalInfo: z.object({
    employmentStatus: z.object({
      status: z.string(),
    }),
    employmentDetails: z
      .object({
        companyName: z.string(),
        jobTitle: z.string(),
        specialization: z.string(),
      })
      .optional(),
    business: z
      .object({
        businessName: z.string(),
        industry: z.string(),
        description: z.string(),
        website: z.string().optional(),
        phoneNumber: z.string().optional(),
      })
      .optional(),
    student: z
      .object({
        schoolName: z.string().optional(),
        fieldOfStudy: z.string().optional(),
        expectedGraduationYear: z.number().optional(),
      })
      .optional(),
  }),
  socialPresence: z.object({
    linkedInProfile: z.string().optional(),
    personalWebsite: z.string().optional(),
  }),
  privacyConsent: z.object({
    termsAccepted: z.boolean(),
    privacyPolicyAccepted: z.boolean(),
    directoryListing: z.boolean(),
    dataSharing: z.boolean(),
    internalConsent: z.boolean(),
    displayInYellowPages: z.boolean(),
    displayPhonePublicly: z.boolean(),
  }),
  isApproved: z.boolean().optional().default(false),
  softDeleted: z.boolean().optional().default(false),
  lastModifiedBy: z.string().optional(),
});

export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    const parsed = membershipRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors },
        { status: 400, statusText: "Bad Request" }
      );
    }
    const membershipData = parsed.data;
    const membershipRequest = await MembershipRequest.create(membershipData);
    return NextResponse.json(membershipRequest, {
      status: 201,
      statusText: "Created",
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message },
      { status: 500, statusText: "Internal Server Error" }
    );
  }
}
