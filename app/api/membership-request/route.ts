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
  visibility: z.object({
    profile: z.string(),
    contact: z.object({
      email: z.string(),
      phone: z.string(),
      address: z.string(),
    }),
    employment: z.object({
      current: z.string(),
      history: z.string(),
    }),
    social: z.string(),
    phoneNumber: z.string().optional(),
  }).optional(),
  isApproved: z.boolean().default(false),
  softDeleted: z.boolean().optional(),
  lastModifiedBy: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Parse and validate the request body
    const parsed = membershipRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors },
        { status: 400, statusText: "Bad Request" }
      );
    }
    
    const data = parsed.data;

    // Check if user already has a pending or approved request
    const existingRequest = await MembershipRequest.findOne({
      'memberLogin.uid': data.memberLogin.uid,
      $or: [
        { isApproved: true },
        { isApproved: false, softDeleted: { $ne: true } }
      ]
    });

    if (existingRequest) {
      console.log(`Duplicate request for user ${data.memberLogin.uid} - request already exists`);
      return NextResponse.json(
        { message: "A membership request already exists for this user" },
        { status: 200 }
      );
    }

    // Ensure visibility settings are in public/private format
    // Create default visibility settings if not provided
    if (!data.visibility) {
      const phoneVisibility = data.privacyConsent.displayPhonePublicly ? 'public' : 'private';
      const displayInYellowPages = data.privacyConsent.displayInYellowPages ? 'public' : 'private';
      
      data.visibility = {
        profile: 'public',
        contact: {
          email: displayInYellowPages,
          phone: phoneVisibility,
          address: 'private',
        },
        employment: {
          current: displayInYellowPages,
          history: 'private',
        },
        social: displayInYellowPages,
        phoneNumber: phoneVisibility
      };
    } else {
      // Process existing visibility settings
      const mapValue = (value: string) => value === 'members' ? 'private' : (value === 'public' || value === 'private' ? value : 'private');
      
      if (data.visibility.profile) {
        data.visibility.profile = mapValue(data.visibility.profile);
      }
      
      if (data.visibility.social) {
        data.visibility.social = mapValue(data.visibility.social);
      }
      
      if (data.visibility.contact) {
        if (data.visibility.contact.email) {
          data.visibility.contact.email = mapValue(data.visibility.contact.email);
        }
        if (data.visibility.contact.phone) {
          data.visibility.contact.phone = mapValue(data.visibility.contact.phone);
        }
        if (data.visibility.contact.address) {
          data.visibility.contact.address = mapValue(data.visibility.contact.address);
        }
      }
      
      if (data.visibility.employment) {
        if (data.visibility.employment.current) {
          data.visibility.employment.current = mapValue(data.visibility.employment.current);
        }
        if (data.visibility.employment.history) {
          data.visibility.employment.history = mapValue(data.visibility.employment.history);
        }
      }
      
      if (data.visibility.phoneNumber) {
        data.visibility.phoneNumber = mapValue(data.visibility.phoneNumber);
      }
    }

    // Create new membership request
    const membershipRequest = new MembershipRequest(data);
    await membershipRequest.save();

    return NextResponse.json(membershipRequest, { status: 201 });
  } catch (error) {
    console.error("Error creating membership request:", error);
    let errorMessage = "Failed to create membership request";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
