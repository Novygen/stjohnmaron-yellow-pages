import { NextResponse } from "next/server";
import { withAdminApiAuth } from "@/utils/withAdminApiAuth";
import MembershipRequest, { IMembershipRequest } from "@/models/MembershipRequest";
import Member from "@/models/Member";
import dbConnect from "@/lib/dbConnect";
import { ApiContext } from "@/app/utils/withAdminApiAuth";

async function patchHandler(
  request: Request,
  context: ApiContext
) {
  await dbConnect();
  const { action, notes } = await request.json();
  
  const membershipRequest = await MembershipRequest.findById(context.params.id);
  if (!membershipRequest) {
    return NextResponse.json(
      { error: "Membership request not found" },
      { status: 404 }
    );
  }

  switch (action) {
    case 'approve':
      // Create new member from request
      const member = new Member({
        uid: membershipRequest.memberLogin.uid,
        personalDetails: membershipRequest.personalDetails,
        contactInformation: membershipRequest.contactInformation,
        employments: createEmploymentsFromRequest(membershipRequest),
        socialPresence: membershipRequest.socialPresence,
        visibility: createDefaultVisibility(),
        status: 'active',
        memberSince: new Date(),
        lastUpdated: new Date(),
      });

      await member.save();

      // Update request status
      membershipRequest.isApproved = true;
      await membershipRequest.save();
      break;

    case 'reject':
      // Soft delete the request and allow resubmission
      membershipRequest.softDeleted = true;
      membershipRequest.notes = notes;
      await membershipRequest.save();
      break;

    case 'update':
      // Request updates from the user
      membershipRequest.softDeleted = true;
      membershipRequest.notes = notes;
      await membershipRequest.save();
      break;

    default:
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      );
  }

  return NextResponse.json(membershipRequest);
}

// Helper function to create employments array from request
function createEmploymentsFromRequest(request: IMembershipRequest) {
  const employments = [];
  const statuses = request.professionalInfo.employmentStatus.status.split(',');

  if (statuses.includes('employed') && request.professionalInfo.employmentDetails) {
    employments.push({
      type: 'employed' as const,
      details: {
        companyName: request.professionalInfo.employmentDetails.companyName,
        jobTitle: request.professionalInfo.employmentDetails.jobTitle,
        specialization: request.professionalInfo.employmentDetails.specialization,
      },
      isActive: true,
      startDate: new Date(),
    });
  }

  if (statuses.includes('business_owner') && request.professionalInfo.business) {
    employments.push({
      type: 'business_owner' as const,
      details: {
        businessName: request.professionalInfo.business.businessName,
        industry: request.professionalInfo.business.industry,
        description: request.professionalInfo.business.description,
        website: request.professionalInfo.business.website,
        phoneNumber: request.professionalInfo.business.phoneNumber,
      },
      isActive: true,
      startDate: new Date(),
    });
  }

  if (statuses.includes('student') && request.professionalInfo.student) {
    employments.push({
      type: 'student' as const,
      details: {
        schoolName: request.professionalInfo.student.schoolName,
        fieldOfStudy: request.professionalInfo.student.fieldOfStudy,
        expectedGraduationYear: request.professionalInfo.student.expectedGraduationYear,
      },
      isActive: true,
      startDate: new Date(),
    });
  }

  return employments;
}

// Helper function to create default visibility settings
function createDefaultVisibility() {
  return {
    profile: 'public' as const,
    contact: {
      email: 'members' as const,
      phone: 'members' as const,
      address: 'members' as const,
    },
    employment: {
      current: 'public' as const,
      history: 'members' as const,
    },
    social: 'public' as const,
  };
}

export async function getHandler(
  request: Request,
  context: ApiContext
) {
  try {
    await dbConnect();
    const uid = await context.params.id;
    
    // Find any approved requests
    const approvedRequest = await MembershipRequest.findOne({
      'memberLogin.uid': uid,
      isApproved: true
    });

    if (approvedRequest) {
      return NextResponse.json({ submitted: false });
    }

    // Find the most recent request
    const recentRequest = await MembershipRequest.findOne({
      'memberLogin.uid': uid,
    }).sort({ createdAt: -1 });

    // If there is a recent request that's either pending or rejected
    const submitted = !!recentRequest && !recentRequest.isApproved;
    
    return NextResponse.json({ submitted });
  } catch (error) {
    console.error('Failed to check membership request status:', error);
    return NextResponse.json(
      { error: "Failed to check membership request status" },
      { status: 500 }
    );
  }
}

export const PATCH = withAdminApiAuth(patchHandler);
export const GET = getHandler;