import { NextResponse } from 'next/server';
import { withAdminApiAuth, RouteParams } from '@/app/utils/withAdminApiAuth';
import MembershipRequest from '@/models/MembershipRequest';
import Member from "@/models/Member";
import dbConnect from '@/lib/dbConnect';

async function getHandler(
  request: Request,
  context: RouteParams
) {
  await dbConnect();
  
  const requestId = context.params.id as string;
  const membershipRequest = await MembershipRequest.findById(requestId);
  
  if (!membershipRequest) {
    return NextResponse.json(
      { error: 'Membership request not found' },
      { status: 404 }
    );
  }
  
  return NextResponse.json(membershipRequest);
}

async function patchHandler(
  request: Request,
  context: RouteParams
) {
  await dbConnect();
  
  const requestId = context.params.id as string;
  const { action, adminNotes } = await request.json();
  
  try {
    const membershipRequest = await MembershipRequest.findById(requestId);
    
    if (!membershipRequest) {
      return NextResponse.json(
        { error: "Request not found" },
        { status: 404 }
      );
    }

    if (action === 'approve') {
      // Create new member from request
      const employments = [];
      const statuses = membershipRequest.professionalInfo.employmentStatus.status.split(',');
      
      // Handle employed status
      if (statuses.includes('employed') && membershipRequest.professionalInfo.employmentDetails) {
        employments.push({
          type: 'employed',
          details: {
            companyName: membershipRequest.professionalInfo.employmentDetails.companyName,
            jobTitle: membershipRequest.professionalInfo.employmentDetails.jobTitle,
            specialization: membershipRequest.professionalInfo.employmentDetails.specialization,
          },
          isActive: true,
          startDate: new Date(),
        });
      }
      
      // Handle business owner status
      if (statuses.includes('business_owner') && membershipRequest.professionalInfo.business) {
        employments.push({
          type: 'business_owner',
          details: {
            businessName: membershipRequest.professionalInfo.business.businessName,
            industry: membershipRequest.professionalInfo.business.industry,
            description: membershipRequest.professionalInfo.business.description,
            website: membershipRequest.professionalInfo.business.website,
            phoneNumber: membershipRequest.professionalInfo.business.phoneNumber,
          },
          isActive: true,
          startDate: new Date(),
        });
      }
      
      // Handle student status
      if (statuses.includes('student') && membershipRequest.professionalInfo.student) {
        employments.push({
          type: 'student',
          details: {
            schoolName: membershipRequest.professionalInfo.student.schoolName,
            fieldOfStudy: membershipRequest.professionalInfo.student.fieldOfStudy,
            expectedGraduationYear: membershipRequest.professionalInfo.student.expectedGraduationYear,
          },
          isActive: true,
          startDate: new Date(),
        });
      }

      const newMember = new Member({
        uid: membershipRequest.memberLogin.uid,
        personalDetails: membershipRequest.personalDetails,
        contactInformation: membershipRequest.contactInformation,
        employments: employments,
        visibility: {
          profile: membershipRequest.privacyConsent.displayInYellowPages ? 'public' : 'private',
          contact: {
            email: membershipRequest.privacyConsent.displayInYellowPages ? 'public' : 'private',
            phone: membershipRequest.privacyConsent.displayPhonePublicly ? 'public' : 'private',
            address: 'private'
          },
          employment: {
            current: 'public',
            history: 'private'
          },
          social: membershipRequest.privacyConsent.displayInYellowPages ? 'public' : 'private',
          phoneNumber: membershipRequest.privacyConsent.displayPhonePublicly ? 'public' : 'private'
        },
        status: 'active',
        memberSince: new Date(),
        lastUpdated: new Date(),
        lastUpdatedBy: 'system'
      });

      await newMember.save();
      
      // Update request status
      membershipRequest.isApproved = true;
      if (adminNotes) membershipRequest.notes = adminNotes;
      await membershipRequest.save();
      
    } else if (action === 'update') {
      // Soft delete the current request to allow for resubmission
      membershipRequest.softDeleted = true;
      if (adminNotes) membershipRequest.notes = adminNotes;
      await membershipRequest.save();
    } else {
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      );
    }
    
    return NextResponse.json(membershipRequest);
  } catch (error) {
    console.error('Error updating request:', error);
    return NextResponse.json(
      { error: "Failed to update request" },
      { status: 500 }
    );
  }
}

export const GET = withAdminApiAuth(getHandler);
export const PATCH = withAdminApiAuth(patchHandler); 