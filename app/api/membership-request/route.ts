import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import MembershipRequest from "@/models/MembershipRequest";
import { z } from "zod";
import mongoose from "mongoose";

// Define individual object schemas
const employmentDetailsSchema = z.object({
  companyName: z.string(),
  jobTitle: z.string(),
  specialization: z.string(),
});

const businessSchema = z.object({
  businessName: z.string(),
  industry: z.string(),
  description: z.string(),
  website: z.string().optional(),
  phoneNumber: z.string().optional(),
  businessEmail: z.string().optional(),
});

const studentSchema = z.object({
  schoolName: z.string().optional(),
  fieldOfStudy: z.string().optional(),
  expectedGraduationYear: z.number().optional(),
});

const skillsSchema = z.object({
  skills: z.string().optional(),
  description: z.string().optional(),
}).optional();

// Primary schema with conditional validation
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
    parishStatus: z.object({
      status: z.enum(['member', 'visitor', 'other_parish']),
      otherParishName: z.string().optional(),
    }).optional(),
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
  professionalInfo: z
    .object({
    employmentStatus: z.object({
        status: z.string().min(1, "Employment status is required"),
      }),
      employmentDetails: employmentDetailsSchema.optional(),
      business: businessSchema.optional(),
      businesses: z.array(businessSchema).optional().default([]),
      student: studentSchema.optional(),
      skills: skillsSchema,
    })
    .refine(
      (data) => {
        // If 'employed' status is selected, employmentDetails should be present and valid
        if (data.employmentStatus.status.includes('employed')) {
          return !!data.employmentDetails && 
            !!data.employmentDetails.companyName &&
            !!data.employmentDetails.jobTitle &&
            !!data.employmentDetails.specialization;
        }
        return true;
      },
      {
        message: "Employment details are required when 'employed' status is selected",
        path: ["employmentDetails"],
      }
    )
    .refine(
      (data) => {
        // If 'business_owner' status is selected, either businesses array or business should be valid
        if (data.employmentStatus.status.includes('business_owner')) {
          // Check businesses array first
          if (data.businesses && data.businesses.length > 0) {
            return data.businesses.some((b: { businessName?: string; industry?: string; description?: string }) => 
              b.businessName && b.industry && b.description);
          }
          // Fall back to single business
          if (data.business) {
            return !!data.business.businessName && 
              !!data.business.industry && 
              !!data.business.description;
          }
          return false; // Neither exists
        }
        return true;
      },
      {
        message: "Business information is required when 'business_owner' status is selected",
        path: ["businesses"],
      }
    ),
  socialPresence: z.object({
    linkedInProfile: z.string().optional(),
    personalWebsite: z.string().optional(),
    instagramProfile: z.string().optional(),
    facebookProfile: z.string().optional(),
    xProfile: z.string().optional(),
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
    
    // Log the incoming request
    console.log("Received membership request body:", JSON.stringify(body, null, 2));
    
    // Handle empty or undefined professionalInfo
    if (!body.professionalInfo || !body.professionalInfo.employmentStatus) {
      console.log("Adding default professionalInfo");
      body.professionalInfo = {
        employmentStatus: { status: 'other' },
        businesses: []
      };
    }
    
    // Enhanced validation for employment status fields
    try {
      if (body.professionalInfo?.employmentStatus?.status) {
        const statuses = body.professionalInfo.employmentStatus.status.split(',');
        
        // Check for employed status
        if (statuses.includes('employed') && 
            (!body.professionalInfo.employmentDetails || 
             !body.professionalInfo.employmentDetails.companyName ||
             !body.professionalInfo.employmentDetails.jobTitle ||
             !body.professionalInfo.employmentDetails.specialization)) {
          return NextResponse.json(
            { 
              error: "Required employment details missing. When selecting 'Employed', you must provide Company Name, Job Title, and Specialization." 
            },
            { status: 400, statusText: "Bad Request" }
          );
        }
        
        // Check for business owner status
        if (statuses.includes('business_owner')) {
          const hasValidBusinesses = body.professionalInfo.businesses && 
            body.professionalInfo.businesses.length > 0 && 
            body.professionalInfo.businesses.some((b: { businessName?: string; industry?: string; description?: string }) => 
              b.businessName && b.industry && b.description);
          
          const hasValidBusiness = body.professionalInfo.business && 
            body.professionalInfo.business.businessName && 
            body.professionalInfo.business.industry && 
            body.professionalInfo.business.description;
            
          if (!hasValidBusinesses && !hasValidBusiness) {
            return NextResponse.json(
              { 
                error: "Required business details missing. When selecting 'Business Owner', you must provide Business Name, Industry, and Description." 
              },
              { status: 400, statusText: "Bad Request" }
            );
          }
        }
      }
    } catch (validationError) {
      console.error("Manual validation error:", validationError);
    }
    
    // Parse and validate the request body
    const parsed = membershipRequestSchema.safeParse(body);
    if (!parsed.success) {
      console.error("Schema validation failed:", JSON.stringify(parsed.error.format(), null, 2));
      
      // Extract the most relevant error message
      const errorObj = parsed.error.format();
      let errorMessage = "Validation failed";
      
      if (errorObj.professionalInfo?._errors?.length) {
        errorMessage = errorObj.professionalInfo._errors[0];
      } 
      else if (errorObj.professionalInfo?.employmentStatus?._errors?.length) {
        errorMessage = "Employment status is required";
      }
      else if (errorObj.professionalInfo?.employmentDetails?._errors?.length) {
        errorMessage = "Employment details are required for employed status";
      }
      else if (errorObj.professionalInfo?.businesses?._errors?.length || 
               errorObj.professionalInfo?.business?._errors?.length) {
        errorMessage = "Business information is required for business owner status";
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 400, statusText: "Bad Request" }
      );
    }
    
    const data = parsed.data;

    // Generate a unique request ID based on user ID to enforce uniqueness
    const requestId = `${data.memberLogin.uid}_${Date.now()}`;
    
    // Check if user already has ANY membership request (active or inactive)
    // Use a more aggressive query to find ALL requests for this user
    const existingRequests = await MembershipRequest.find({
      'memberLogin.uid': data.memberLogin.uid
    });

    if (existingRequests.length > 0) {
      console.log(`User ${data.memberLogin.uid} already has ${existingRequests.length} membership request(s)`);
      
      // Find the most recent request
      const mostRecentRequest = existingRequests.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0];
      
      // If request was created in the last minute, it's likely a duplicate submission
      const isRecentSubmission = (Date.now() - new Date(mostRecentRequest.createdAt).getTime()) < 60000;
      
      if (isRecentSubmission) {
        console.log(`Recent submission detected for user ${data.memberLogin.uid} - returning existing request`);
        return NextResponse.json(mostRecentRequest, { status: 200 });
      }
      
      // If request is approved or pending (not soft-deleted), return it
      if (mostRecentRequest.isApproved || !mostRecentRequest.softDeleted) {
        return NextResponse.json(
          { message: "A membership request already exists for this user" },
          { status: 200 }
        );
      }
      
      // Otherwise, allow a new submission since the previous one was rejected
      console.log(`Previous request was rejected, allowing new submission for user ${data.memberLogin.uid}`);
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
    try {
      // ===== BUSINESS OWNER SPECIAL HANDLING =====
      // If this is a business_owner submission, ensure the data is properly formatted
      if (data.professionalInfo?.employmentStatus?.status?.includes('business_owner')) {
        console.log("Business owner special handling activated");
        
        // Make sure the businesses array exists and is correctly formatted
        if (!data.professionalInfo.businesses) {
          data.professionalInfo.businesses = [];
        }
        
        // If there's a single business object but no businesses in array, convert it
        if (data.professionalInfo.business && 
            (!Array.isArray(data.professionalInfo.businesses) || 
             data.professionalInfo.businesses.length === 0)) {
          console.log("Converting single business to array", data.professionalInfo.business);
          data.professionalInfo.businesses = [data.professionalInfo.business];
        }
        
        // Log the business data for debugging
        console.log("Business data after preprocessing:", {
          hasBusinesses: Array.isArray(data.professionalInfo.businesses),
          businessesCount: Array.isArray(data.professionalInfo.businesses) ? data.professionalInfo.businesses.length : 0,
          businesses: data.professionalInfo.businesses,
          hasSingleBusiness: !!data.professionalInfo.business,
          singleBusiness: data.professionalInfo.business
        });
        
        // Validate business data exists and has required fields
        const hasValidBusinesses = Array.isArray(data.professionalInfo.businesses) && 
          data.professionalInfo.businesses.length > 0 && 
          data.professionalInfo.businesses.some(b => 
            b && b.businessName && b.industry && b.description);

        // If validation failed, return an error
        if (!hasValidBusinesses) {
          // Check legacy business as fallback
          if (data.professionalInfo.business && 
              data.professionalInfo.business.businessName && 
              data.professionalInfo.business.industry && 
              data.professionalInfo.business.description) {
            
            console.log("Using legacy business data");
            // Use the legacy business directly
            data.professionalInfo.businesses = [data.professionalInfo.business];
          } else {
            console.log("No valid business data found, returning error");
            return NextResponse.json({
              error: "Business information is required when selecting 'Business Owner'. Please provide at least one business with name, industry, and description."
            }, { status: 400 });
          }
        }
      }
      
      // ===== DIRECT DATABASE INSERT APPROACH =====
      // This bypasses Mongoose validation issues
      console.log("Using direct database insert approach");
      
      // Prepare the document for direct insertion
      const membershipRequestDoc = {
        ...data,
        requestId,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Get a direct reference to the MongoDB collection
      if (!mongoose.connection || !mongoose.connection.db) {
        throw new Error("Database connection not established");
      }
      const db = mongoose.connection.db;
      const collection = db.collection('membershiprequests');
      
      // Insert the document directly using the MongoDB driver
      const insertResult = await collection.insertOne(membershipRequestDoc);
      
      if (insertResult.acknowledged) {
        console.log(`Direct insert successful for user ${data.memberLogin.uid}, ID: ${insertResult.insertedId}`);
        return NextResponse.json({ 
          _id: insertResult.insertedId,
          ...membershipRequestDoc
        }, { status: 201 });
      } else {
        throw new Error("Failed to insert membership request");
      }
    } catch (dbError: unknown) {
      console.error("Database error:", dbError);
      
      // Check if this is a duplicate key error (E11000)
      if (typeof dbError === 'object' && dbError !== null && 'code' in dbError && dbError.code === 11000) {
        console.log("Duplicate key error - checking if request exists");
        
        try {
          // Check if this request ID already exists
          if (!mongoose.connection || !mongoose.connection.db) {
            throw new Error("Database connection not established");
          }
          const db = mongoose.connection.db;
          const collection = db.collection('membershiprequests');
          const existingRequest = await collection.findOne({ requestId });
          
          if (existingRequest) {
            console.log("Request already exists in database, returning success");
            return NextResponse.json(existingRequest, { status: 200 });
          }
        } catch (findError) {
          console.error("Error checking for existing request:", findError);
        }
      }
      
      // Special handling for business_owner validation failures
      if (data.professionalInfo?.employmentStatus?.status?.includes('business_owner')) {
        console.log("Business owner validation failure - providing detailed error");
        
        return NextResponse.json({ 
          error: "Business owner validation failed. Please ensure you've provided a business name, industry, and description.",
          details: {
            businesses: data.professionalInfo.businesses,
            business: data.professionalInfo.business
          }
        }, { status: 400 });
      }
      
      return NextResponse.json({ 
        error: "Database error - could not save membership request",
        details: dbError instanceof Error ? dbError.message : "Unknown error"
      }, { status: 500 });
    }
  } catch (error) {
    console.error("Error creating membership request:", error);
    let errorMessage = "Failed to create membership request";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
