import { NextResponse } from 'next/server';
import dbConnect from "@/lib/dbConnect";
import Member from "@/models/Member";
import { IEmployment } from "@/models/Member";

export async function GET(request: Request) {
  try {
    await dbConnect();
    
    // Parse URL search params
    const { searchParams } = new URL(request.url);
    const industry = searchParams.get('industry');
    const specialization = searchParams.get('specialization');
    const search = searchParams.get('search');
    
    // Build base query - only get members who want to be in directory with public profile
    const query: Record<string, unknown> = {
      'visibility.profile': 'public',
      'status': 'active',
    };
    
    // Add filters
    const employmentFilters = [];
    
    if (industry) {
      // For business owners with specific industry
      employmentFilters.push({
        'employments': {
          $elemMatch: {
            'type': 'business_owner',
            'details.industry': industry,
            'isActive': true
          }
        }
      });
    }
    
    if (specialization) {
      // For employed members with specific specialization
      employmentFilters.push({
        'employments': {
          $elemMatch: {
            'type': 'employed',
            'details.specialization': specialization,
            'isActive': true
          }
        }
      });
    }
    
    // Combine filters with OR if both are specified
    if (employmentFilters.length > 0) {
      query['$or'] = employmentFilters;
    }
    
    // Add search functionality
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      const searchQuery = [
        { 'personalDetails.firstName': searchRegex },
        { 'personalDetails.lastName': searchRegex },
        // Business name for business owners
        { 'employments.details.businessName': searchRegex },
        // Company name and job title for employed
        { 'employments.details.companyName': searchRegex },
        { 'employments.details.jobTitle': searchRegex },
      ];
      
      // If we already have $or for employment filters, we need to use $and to combine with search
      if (query['$or']) {
        query['$and'] = [
          { '$or': query['$or'] as object[] },
          { '$or': searchQuery }
        ];
        delete query['$or'];
      } else {
        query['$or'] = searchQuery;
      }
    }
    
    // Get members
    const members = await Member.find(query).select({
      'uid': 1,
      'personalDetails.firstName': 1,
      'personalDetails.lastName': 1,
      'personalDetails.profileImage': 1,
      'employments': 1,
    });
    
    // Format the response to include only necessary data
    const formattedMembers = members.map(member => {
      // Get all active employments
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
      
      return {
        id: member._id,
        uid: member.uid,
        firstName: member.personalDetails.firstName,
        lastName: member.personalDetails.lastName,
        fullName: `${member.personalDetails.firstName} ${member.personalDetails.lastName}`,
        profileImage: member.personalDetails.profileImage,
        employmentStatuses: activeEmployments,
        // For backward compatibility, include the first active employment as employmentStatus
        employmentStatus: activeEmployments.length > 0 ? activeEmployments[0] : {},
      };
    });
    
    return NextResponse.json(formattedMembers);
  } catch (error) {
    console.error('Error fetching directory members:', error);
    return NextResponse.json(
      { error: 'Failed to fetch directory members' },
      { status: 500 }
    );
  }
} 