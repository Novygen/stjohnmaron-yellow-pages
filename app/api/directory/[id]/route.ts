import { NextResponse } from 'next/server';
import dbConnect from "@/lib/dbConnect";
import Member from "@/models/Member";
import mongoose from 'mongoose';
import { IEmployment } from "@/models/Member";

interface EmploymentInfo {
  type: string;
  companyName?: string;
  jobTitle?: string;
  specialization?: string;
  businessName?: string;
  industry?: string;
  description?: string;
  website?: string;
  schoolName?: string;
  fieldOfStudy?: string;
}

interface MemberResponse {
  id: mongoose.Types.ObjectId;
  personalDetails: {
    firstName: string;
    lastName: string;
    fullName: string;
    profileImage?: string;
  };
  contactInformation?: {
    email?: string;
    phone?: string;
    address?: {
      line1?: string;
      line2?: string;
      city?: string;
      state?: string;
      zip?: string;
      country?: string;
    };
  };
  employmentStatuses?: EmploymentInfo[];
  employmentStatus?: EmploymentInfo; // For backward compatibility
  socialPresence?: {
    linkedInProfile?: string;
    personalWebsite?: string;
  };
}

type RouteParams = {
  params: {
    id: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function GET(request: Request, context: RouteParams) {
  try {
    await dbConnect();
    const memberId = context.params.id;
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(memberId)) {
      return NextResponse.json(
        { error: 'Invalid member ID format' },
        { status: 400 }
      );
    }
    
    // Find the member
    const member = await Member.findOne({
      _id: memberId,
      'visibility.profile': 'public',
      'status': 'active',
    });
    
    if (!member) {
      return NextResponse.json(
        { error: 'Member not found or not publicly available' },
        { status: 404 }
      );
    }
    
    // Format the response based on visibility settings
    const formatMemberResponse = (): MemberResponse => {
      const response: MemberResponse = {
        id: member._id,
        personalDetails: {
          firstName: member.personalDetails.firstName,
          lastName: member.personalDetails.lastName,
          fullName: `${member.personalDetails.firstName} ${member.personalDetails.lastName}`,
          profileImage: member.personalDetails.profileImage,
        },
      };
      
      // Add contact information based on visibility settings
      if (member.visibility.contact.email === 'public') {
        response.contactInformation = {
          ...response.contactInformation,
          email: member.contactInformation.primaryEmail,
        };
      }
      
      if (member.visibility.contact.phone === 'public') {
        response.contactInformation = {
          ...response.contactInformation,
          phone: member.contactInformation.primaryPhoneNumber,
        };
      }
      
      if (member.visibility.contact.address === 'public' && member.contactInformation.address) {
        response.contactInformation = {
          ...response.contactInformation,
          address: member.contactInformation.address,
        };
      }
      
      // Add employment information based on visibility
      if (member.visibility.employment.current === 'public') {
        const activeEmployments = member.employments
          .filter((emp: IEmployment) => emp.isActive)
          .map((emp: IEmployment) => {
            if (emp.type === 'employed') {
              return {
                type: 'employed',
                companyName: emp.details.companyName,
                jobTitle: emp.details.jobTitle,
                specialization: emp.details.specialization,
              };
            } else if (emp.type === 'business_owner') {
              return {
                type: 'business_owner',
                businessName: emp.details.businessName,
                industry: emp.details.industry,
                description: emp.details.description,
                website: emp.details.website,
              };
            } else if (emp.type === 'student') {
              return {
                type: 'student',
                schoolName: emp.details.schoolName,
                fieldOfStudy: emp.details.fieldOfStudy,
              };
            }
            return null;
          })
          .filter(Boolean); // Remove null values
        
        if (activeEmployments.length > 0) {
          response.employmentStatuses = activeEmployments;
          // For backward compatibility
          response.employmentStatus = activeEmployments[0];
        }
      }
      
      // Add social presence based on visibility
      if (member.visibility.social === 'public') {
        response.socialPresence = member.socialPresence;
      }
      
      return response;
    };
    
    const memberData = formatMemberResponse();
    return NextResponse.json(memberData);
  } catch (error) {
    console.error('Error fetching member details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch member details' },
      { status: 500 }
    );
  }
} 