/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { adminAuth } from '@/admin.firebase.server';
import dbConnect from '@/lib/dbConnect';
import Member from '@/models/Member';
import MembershipRequest from '@/models/MembershipRequest';

export async function GET(request: Request) {
  // Verify authentication
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    await dbConnect();
    
    // Verify the token and get the user ID
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;
    
    // First check if user exists in Member collection
    const memberData = await Member.findOne({ uid });
    
    if (memberData) {
      // User is already a member, return full profile
      return NextResponse.json({
        // Personal Details
        firstName: memberData.personalDetails.firstName,
        lastName: memberData.personalDetails.lastName,
        middleName: memberData.personalDetails.middleName,
        ageRange: memberData.personalDetails.ageRange,
        state: memberData.personalDetails.state,
        profileImage: memberData.personalDetails.profileImage,
        parishStatus: memberData.personalDetails.parishStatus,
        
        // Contact Information
        email: memberData.contactInformation.primaryEmail,
        phone: memberData.contactInformation.primaryPhoneNumber,
        address: memberData.contactInformation.address || {},
        
        // Professional Information
        employments: memberData.employments || [],
        skills: memberData.skills || { skills: '', description: '' },
        
        // Social Presence
        socialPresence: memberData.socialPresence || memberData.social || {},
        
        // Visibility Settings
        visibility: memberData.visibility,
        
        // Approval Status
        isApproved: true
      });
    }
    
    // If not a member, check if they have a pending membership request
    const membershipRequest = await MembershipRequest.findOne({ 'memberLogin.uid': uid });
    
    if (membershipRequest) {
      // User has a pending membership request, return data from request
      return NextResponse.json({
        // Personal Details
        firstName: membershipRequest.personalDetails.firstName,
        lastName: membershipRequest.personalDetails.lastName,
        middleName: membershipRequest.personalDetails.middleName,
        ageRange: membershipRequest.personalDetails.ageRange,
        state: membershipRequest.personalDetails.state,
        parishStatus: membershipRequest.personalDetails.parishStatus,
        
        // Contact Information
        email: membershipRequest.contactInformation.primaryEmail,
        phone: membershipRequest.contactInformation.primaryPhoneNumber,
        address: membershipRequest.contactInformation.address || {},
        
        // Professional Information
        // Convert the employment status info to the employments array format
        employments: getEmploymentsFromRequest(membershipRequest),
        skills: membershipRequest.professionalInfo.skills || { skills: '', description: '' },
        
        // Social Presence
        socialPresence: membershipRequest.socialPresence || {},
        
        // Visibility Settings
        visibility: membershipRequest.visibility || {
          profile: 'private',
          contact: {
            email: 'private',
            phone: 'private',
            address: 'private'
          },
          employment: {
            current: 'private',
            history: 'private'
          },
          social: 'private',
          phoneNumber: 'private'
        },
        
        // Approval Status
        isApproved: membershipRequest.isApproved
      });
    }
    
    // User not found in either collection
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
    
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  // Verify authentication
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.split('Bearer ')[1];
  
  try {
    await dbConnect();
    
    // Verify the token and get the user ID
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;
    
    // Get the update data
    const updates = await request.json();
    
    // First check if user exists in Member collection
    const memberData = await Member.findOne({ uid });
    
    if (memberData) {
      // User is already a member, update their information
      
      // Update personal details
      if (updates.firstName) memberData.personalDetails.firstName = updates.firstName;
      if (updates.lastName) memberData.personalDetails.lastName = updates.lastName;
      if (updates.middleName !== undefined) memberData.personalDetails.middleName = updates.middleName;
      if (updates.state) memberData.personalDetails.state = updates.state;
      if (updates.profileImage) memberData.personalDetails.profileImage = updates.profileImage;
      
      // Update parish status if provided
      if (updates.parishStatus) {
        memberData.personalDetails.parishStatus = updates.parishStatus;
      }
      
      // Update contact information
      if (updates.phone) {
        memberData.contactInformation.primaryPhoneNumber = updates.phone;
      }
      
      // Update address if provided
      if (updates.address) {
        memberData.contactInformation.address = updates.address;
      }
      
      // Update employment information
      if (updates.employments) {
        memberData.employments = updates.employments;
      }
      
      // Update skills
      if (updates.skills) {
        memberData.skills = updates.skills;
      }
      
      // Update social presence
      if (updates.socialPresence) {
        memberData.socialPresence = updates.socialPresence;
        // Keep social field in sync for backward compatibility
        memberData.social = updates.socialPresence;
      }
      
      // Update visibility settings
      if (updates.visibility) {
        memberData.visibility = updates.visibility;
      }
      
      // Update metadata
      memberData.lastUpdated = new Date();
      memberData.lastUpdatedBy = uid;
      
      await memberData.save();
      
      // Return the updated member data
      return NextResponse.json({
        // Personal Details
        firstName: memberData.personalDetails.firstName,
        lastName: memberData.personalDetails.lastName,
        middleName: memberData.personalDetails.middleName,
        ageRange: memberData.personalDetails.ageRange,
        state: memberData.personalDetails.state,
        profileImage: memberData.personalDetails.profileImage,
        parishStatus: memberData.personalDetails.parishStatus,
        
        // Contact Information
        email: memberData.contactInformation.primaryEmail,
        phone: memberData.contactInformation.primaryPhoneNumber,
        address: memberData.contactInformation.address || {},
        
        // Professional Information
        employments: memberData.employments || [],
        skills: memberData.skills || { skills: '', description: '' },
        
        // Social Presence
        socialPresence: memberData.socialPresence || memberData.social || {},
        
        // Visibility Settings
        visibility: memberData.visibility,
        
        // Approval Status
        isApproved: true
      });
    }
    
    // If not a member, check if they have an approved membership request
    const membershipRequest = await MembershipRequest.findOne({ 'memberLogin.uid': uid });
    
    if (membershipRequest && membershipRequest.isApproved) {
      // User has an approved membership request, update their information
      
      // Update personal details
      if (updates.firstName) membershipRequest.personalDetails.firstName = updates.firstName;
      if (updates.lastName) membershipRequest.personalDetails.lastName = updates.lastName;
      if (updates.middleName !== undefined) membershipRequest.personalDetails.middleName = updates.middleName;
      if (updates.state) membershipRequest.personalDetails.state = updates.state;
      if (updates.parishStatus) membershipRequest.personalDetails.parishStatus = updates.parishStatus;
      
      // Update contact information
      if (updates.phone) {
        membershipRequest.contactInformation.primaryPhoneNumber = updates.phone;
      }
      
      // Update address if provided
      if (updates.address) {
        membershipRequest.contactInformation.address = updates.address;
      }
      
      // Update skills
      if (updates.skills) {
        membershipRequest.professionalInfo.skills = updates.skills;
      }
      
      // Update social presence
      if (updates.socialPresence) {
        membershipRequest.socialPresence = updates.socialPresence;
      }
      
      // Update visibility settings
      if (updates.visibility) {
        membershipRequest.visibility = updates.visibility;
      }
      
      await membershipRequest.save();
      
      return NextResponse.json({
        // Personal Details
        firstName: membershipRequest.personalDetails.firstName,
        lastName: membershipRequest.personalDetails.lastName,
        middleName: membershipRequest.personalDetails.middleName,
        ageRange: membershipRequest.personalDetails.ageRange,
        state: membershipRequest.personalDetails.state,
        parishStatus: membershipRequest.personalDetails.parishStatus,
        
        // Contact Information
        email: membershipRequest.contactInformation.primaryEmail,
        phone: membershipRequest.contactInformation.primaryPhoneNumber,
        address: membershipRequest.contactInformation.address || {},
        
        // Professional Information
        employments: getEmploymentsFromRequest(membershipRequest),
        skills: membershipRequest.professionalInfo.skills || { skills: '', description: '' },
        
        // Social Presence
        socialPresence: membershipRequest.socialPresence || {},
        
        // Visibility Settings
        visibility: membershipRequest.visibility || {
          profile: 'private',
          contact: {
            email: 'private',
            phone: 'private',
            address: 'private'
          },
          employment: {
            current: 'private',
            history: 'private'
          },
          social: 'private',
          phoneNumber: 'private'
        },
        
        // Approval Status
        isApproved: true
      });
    } else if (membershipRequest && !membershipRequest.isApproved) {
      // Request exists but is not approved, cannot update
      return NextResponse.json(
        { error: 'Membership not approved, cannot update profile' },
        { status: 403 }
      );
    }
    
    // User not found in either collection
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}

// Helper function to convert membership request professional info to employments array
function getEmploymentsFromRequest(membershipRequest: any) {
  const employments = [];
  const statuses = membershipRequest.professionalInfo.employmentStatus?.status?.split(',') || [];
  
  // Handle employed status
  if (statuses.includes('employed') && membershipRequest.professionalInfo.employmentDetails) {
    employments.push({
      type: 'employed',
      details: {
        companyName: membershipRequest.professionalInfo.employmentDetails.companyName,
        jobTitle: membershipRequest.professionalInfo.employmentDetails.jobTitle,
        specialization: membershipRequest.professionalInfo.employmentDetails.specialization,
      },
      isActive: true
    });
  }
  
  // Handle business owner status
  if (statuses.includes('business_owner')) {
    // Check if we have the businesses array
    if (membershipRequest.professionalInfo.businesses && 
        membershipRequest.professionalInfo.businesses.length > 0) {
      
      // Process each business in the array
      membershipRequest.professionalInfo.businesses.forEach((business: any) => {
        employments.push({
          type: 'business_owner',
          details: {
            businessName: business.businessName,
            industry: business.industry,
            description: business.description,
            website: business.website || "",
            phoneNumber: business.phoneNumber || "",
            businessEmail: business.businessEmail || "",
          },
          isActive: true
        });
      });
    } 
    // Fallback to legacy single business format
    else if (membershipRequest.professionalInfo.business) {
      employments.push({
        type: 'business_owner',
        details: {
          businessName: membershipRequest.professionalInfo.business.businessName,
          industry: membershipRequest.professionalInfo.business.industry,
          description: membershipRequest.professionalInfo.business.description,
          website: membershipRequest.professionalInfo.business.website || "",
          phoneNumber: membershipRequest.professionalInfo.business.phoneNumber || "",
          businessEmail: membershipRequest.professionalInfo.business.businessEmail || "",
        },
        isActive: true
      });
    }
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
      isActive: true
    });
  }
  
  return employments;
} 