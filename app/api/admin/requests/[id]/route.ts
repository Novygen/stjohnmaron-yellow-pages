import { NextResponse } from 'next/server';
import { withAdminApiAuth } from "@/utils/withAdminApiAuth";
import MembershipRequest from '@/models/MembershipRequest';
import Member from "@/models/Member";
import dbConnect from '@/lib/dbConnect';
import { ApiContext } from '@/app/utils/withAdminApiAuth';

async function getHandler(
  request: Request,
  context: ApiContext
) {
  await dbConnect();
  const { id } = await context.params;
  
  try {
    const membershipRequest = await MembershipRequest.findById(id);
    
    if (!membershipRequest) {
      return NextResponse.json(
        { error: "Request not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(membershipRequest);
  } catch (error) {
    console.error('Error fetching request:', error);
    return NextResponse.json(
      { error: "Failed to fetch request" },
      { status: 500 }
    );
  }
}

async function patchHandler(
  request: Request,
  context: ApiContext
) {
  await dbConnect();
  const { id } = await context.params;
  const data = await request.json();
  const { action, notes } = data;
  
  try {
    const membershipRequest = await MembershipRequest.findById(id);
    
    if (!membershipRequest) {
      return NextResponse.json(
        { error: "Request not found" },
        { status: 404 }
      );
    }

    if (action === 'approve') {
      // Create new member from request
      const newMember = new Member({
        uid: membershipRequest.memberLogin.uid,
        personalDetails: membershipRequest.personalDetails,
        contactInformation: membershipRequest.contactInformation,
        employments: [
          {
            type: membershipRequest.professionalInfo.employmentStatus.status.includes('employed') ? 'employed' :
                  membershipRequest.professionalInfo.employmentStatus.status.includes('business_owner') ? 'business_owner' :
                  membershipRequest.professionalInfo.employmentStatus.status.includes('student') ? 'student' : 'other',
            details: membershipRequest.professionalInfo.employmentDetails || 
                    membershipRequest.professionalInfo.business ||
                    membershipRequest.professionalInfo.student || {},
            isActive: true,
            startDate: new Date()
          }
        ],
        visibility: {
          profile: 'members',
          contact: {
            email: 'members',
            phone: 'members',
            address: 'private'
          },
          employment: {
            current: 'members',
            history: 'members'
          },
          social: 'members'
        },
        status: 'active',
        lastUpdated: new Date(),
        lastUpdatedBy: 'system'
      });

      await newMember.save();
      
      // Update request status
      membershipRequest.isApproved = true;
      if (notes) membershipRequest.notes = notes;
      await membershipRequest.save();
      
    } else if (action === 'update') {
      // Soft delete the current request to allow for resubmission
      membershipRequest.softDeleted = true;
      if (notes) membershipRequest.notes = notes;
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