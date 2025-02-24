/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import MembershipRequest from "@/models/MembershipRequest";
import { z } from "zod";

// Zod schema to validate the incoming membership request with the updated privacy_consent structure
const membershipRequestSchema = z.object({
  member_login: z.object({
    uid: z.string(),
  }),
  personal_details: z.object({
    first_name: z.string(),
    last_name: z.string(),
    middle_name: z.string().optional(),
  }),
  demographic_information: z.object({
    date_of_birth: z.string(),
    gender: z.string().optional(),
  }),
  contact_information: z.object({
    primary_phone_number: z.string(),
    primary_email: z.string().email(),
    address: z.object({
      line1: z.string(),
      line2: z.string().optional(),
      city: z.string(),
      state: z.string(),
      zip: z.string(),
      country: z.string(),
    }),
  }),
  professional_info: z.object({
    employment_status: z.object({
      status: z.string(),
    }),
    employment_details: z
      .object({
        company_name: z.string(),
        job_title: z.string(),
        industry: z.string(),
        years_of_experience: z.number(),
      })
      .optional(),
    employment_history: z
      .object({
        previous_occupation: z.string(),
        mentorship_interest: z.boolean(),
      })
      .optional(),
    businesses: z.array(
      z.object({
        business_name: z.string(),
        business_type: z.string(),
        has_physical_store: z.boolean(),
        business_address: z.object({
          line1: z.string(),
          line2: z.string().optional(),
          city: z.string(),
          state: z.string(),
          zip: z.string(),
          country: z.string(),
        }),
      })
    ).optional(),
    service_providers: z.array(
      z.object({
        service_name: z.string(),
        service_details: z.array(z.string()),
      })
    ).optional(),
    students: z.array(
      z.object({
        school_name: z.string(),
        field_of_study: z.string(),
        expected_graduation_year: z.number(),
      })
    ).optional(),
  }),
  social_presence: z.object({
    personal_website: z.string().optional(),
    linked_in_profile: z.string().optional(),
    facebook_profile: z.string().optional(),
    instagram_handle: z.string().optional(),
    other_social_media_links: z.array(z.string()),
  }),
  privacy_consent: z.object({
    display_in_yellow_pages: z.boolean(),
    public_visibility: z.object({
      personal_details: z.object({
        first_name: z.boolean().optional(),
        last_name: z.boolean().optional(),
        middle_name: z.boolean().optional(),
      }).optional(),
      demographic_information: z.object({
        date_of_birth: z.boolean().optional(),
        gender: z.boolean().optional(),
      }).optional(),
      contact_information: z.object({
        primary_phone_number: z.boolean().optional(),
        primary_email: z.boolean().optional(),
        address: z.object({
          line1: z.boolean().optional(),
          line2: z.boolean().optional(),
          city: z.boolean().optional(),
          state: z.boolean().optional(),
          zip: z.boolean().optional(),
          country: z.boolean().optional(),
        }).optional()
      }).optional(),
      professional_info: z.object({
        employment_status: z.boolean().optional(),
        employment_details: z.object({
          company_name: z.boolean().optional(),
          job_title: z.boolean().optional(),
          industry: z.boolean().optional(),
          years_of_experience: z.boolean().optional(),
        }).optional(),
        employment_history: z.object({
          previous_occupation: z.boolean().optional(),
          mentorship_interest: z.boolean().optional(),
        }).optional(),
        businesses: z.boolean().optional(),
        service_providers: z.boolean().optional(),
        students: z.boolean().optional(),
      }).optional(),
      social_presence: z.object({
        personal_website: z.boolean().optional(),
        linked_in_profile: z.boolean().optional(),
        facebook_profile: z.boolean().optional(),
        instagram_handle: z.boolean().optional(),
        other_social_media_links: z.boolean().optional(),
      }).optional(),
    }),
  }),
});

export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    const parsed = membershipRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors }, {
        status: 400,
        statusText: "Bad Request",
      });
    }
    const membershipData = parsed.data;
    // Create the membership request document
    const membershipRequest = await MembershipRequest.create(membershipData);
    return NextResponse.json(membershipRequest, {
      status: 201,
      statusText: "Created",
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
}
