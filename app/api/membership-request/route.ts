/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
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
  }),
  contactInformation: z.object({
    primaryPhoneNumber: z.string(),
    primaryEmail: z.string().email(),
    address: z.object({
      line1: z.string(),
      line2: z.string().optional(),
      city: z.string(),
      state: z.string(),
      zip: z.string(),
      country: z.string(),
    }),
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
        startDate: z
          .string()
          .regex(
            /^(0[1-9]|1[0-2])\/\d{4}$/,
            "Invalid format. Expected MM/YYYY"
          ),
      })
      .optional(),
    ownsBusinessOrService: z.boolean().optional(),
    business: z
      .object({
        businessName: z.string(),
        additionalInformation: z.string(),
        website: z.string(),
        phoneNumber: z.string(),
        industry: z.string(),
      })
      .optional(),
    student: z
      .object({
        schoolName: z.string(),
        fieldOfStudy: z.string(),
        expectedGraduationYear: z.number(),
      })
      .optional(),
  }),
  socialPresence: z.object({
    personalWebsite: z.string().optional(),
    linkedInProfile: z.string().optional(),
    facebookProfile: z.string().optional(),
    instagramHandle: z.string().optional(),
  }),
  privacyConsent: z.object({
    internalConsent: z.boolean(),
    displayInYellowPages: z.boolean(),
    displayPhonePublicly: z.boolean(),
  }),
  isApproved: z.boolean().optional().default(false),
  isActioned: z.boolean().optional().default(false),
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
