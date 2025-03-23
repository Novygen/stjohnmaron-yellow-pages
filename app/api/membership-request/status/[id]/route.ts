import { NextResponse, NextRequest } from "next/server";
import { withAdminApiAuth } from "@/app/utils/withAdminApiAuth";
import MembershipRequest, { IMembershipRequest } from "@/models/MembershipRequest";
import Member from "@/models/Member";
import dbConnect from "@/lib/dbConnect";
import { tParams as AdminApiParams } from "@/app/utils/withAdminApiAuth";

type tParams = { id: string };

async function patchHandler(
  request: NextRequest,
  { params }: { params: tParams }
) {
  await dbConnect();
  const { action, notes } = await request.json();
  const memberId = params.id;
  
  const membershipRequest = await MembershipRequest.findById(memberId);
  if (!membershipRequest) {
    return NextResponse.json(
      { error: "Membership request not found" },
      { status: 404 }
    );
  }

  switch (action) {
    case 'approve':
      // Create new member from request
      console.log('Creating member with social presence:', membershipRequest.socialPresence);

      const member = new Member({
        uid: membershipRequest.memberLogin.uid,
        personalDetails: membershipRequest.personalDetails,
        contactInformation: membershipRequest.contactInformation,
        employments: createEmploymentsFromRequest(membershipRequest),
        socialPresence: membershipRequest.socialPresence,
        social: membershipRequest.socialPresence,
        visibility: membershipRequest.privacyConsent ? mapVisibilitySettings({
          profile: 'public',
          contact: {
            email: membershipRequest.privacyConsent.displayInYellowPages ? 'public' : 'private',
            phone: membershipRequest.privacyConsent.displayPhonePublicly ? 'public' : 'private',
            address: 'private',
          },
          employment: {
            current: 'public',
            history: 'private',
          },
          social: 'public'
        }) : createDefaultVisibility(),
        status: 'active',
        memberSince: new Date(),
        lastUpdated: new Date(),
        lastUpdatedBy: 'system'
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
  console.log('Employment statuses:', statuses);
  console.log('Professional info:', JSON.stringify(request.professionalInfo, null, 2));

  // Handle employed status
  if (statuses.includes('employed') && request.professionalInfo.employmentDetails) {
    console.log('Adding employed status');
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

  // Handle business owner status
  if (statuses.includes('business_owner') && request.professionalInfo.business) {
    console.log('Adding business owner status');
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

  // Handle student status
  if (statuses.includes('student') && request.professionalInfo.student) {
    console.log('Adding student status');
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

  console.log('Final employments array:', JSON.stringify(employments, null, 2));
  return employments;
}

// Helper function to create default visibility settings
function createDefaultVisibility() {
  return {
    profile: 'public' as const,
    contact: {
      email: 'private' as const,
      phone: 'private' as const,
      address: 'private' as const,
    },
    employment: {
      current: 'public' as const,
      history: 'private' as const,
    },
    social: 'public' as const
  };
}

// Helper function to map existing visibility settings
function mapVisibilitySettings(visibility: {
  profile: string;
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  employment: {
    current: string;
    history: string;
  };
  social: string;
  phoneNumber?: string;
}) {
  const mapValue = (value: string) => value === 'members' ? 'private' : value;
  
  // Ensure phone visibility is consistent
  const phoneVisibility = visibility.phoneNumber || visibility.contact.phone;
  
  return {
    profile: mapValue(visibility.profile),
    contact: {
      email: mapValue(visibility.contact.email),
      phone: mapValue(phoneVisibility),
      address: mapValue(visibility.contact.address),
    },
    employment: {
      current: mapValue(visibility.employment.current),
      history: mapValue(visibility.employment.history),
    },
    social: 'public',
    phoneNumber: mapValue(phoneVisibility)
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: AdminApiParams }
) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const uid = resolvedParams.id;
    
    // Find any approved requests
    const approvedRequest = await MembershipRequest.findOne({
      'memberLogin.uid': uid,
      isApproved: true
    });

    if (approvedRequest) {
      return NextResponse.json({ submitted: true });
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

export const PATCH = withAdminApiAuth(async (
  request: NextRequest,
  context: { params: AdminApiParams }
) => {
  const resolvedParams = await context.params;
  return patchHandler(request, { params: { id: resolvedParams.id } });
});
