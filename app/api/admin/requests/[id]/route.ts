/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import MembershipRequest from '@/models/MembershipRequest';
import Member from "@/models/Member";
import dbConnect from '@/lib/dbConnect';
import mongoose from 'mongoose';

type tParams = Promise<{ id: string }>;

async function getHandler(
  request: Request,
  { params }: { params: tParams }
) {
  await dbConnect();
  
  try {
    const requestId = (await params).id;
    const membershipRequest = await MembershipRequest.findById(requestId);
    
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
  { params }: { params: tParams }
) {
  await dbConnect();
  
  const requestId = (await params).id;
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
      // Check if member already exists to prevent duplicates
      const existingMember = await Member.findOne({ uid: membershipRequest.memberLogin.uid });
      
      if (existingMember) {
        console.log(`Member already exists for UID: ${membershipRequest.memberLogin.uid}, skipping creation`);
        
        // Just update the request status
        try {
          if (!mongoose.connection || !mongoose.connection.db) {
            throw new Error("Database connection not established");
          }
          const db = mongoose.connection.db;
          const collection = db.collection('membershiprequests');
          
          // Update directly using MongoDB driver
          const updateResult = await collection.updateOne(
            { _id: membershipRequest._id },
            { 
              $set: { 
                isApproved: true,
                notes: adminNotes || membershipRequest.notes 
              } 
            }
          );
          
          if (!updateResult.acknowledged) {
            throw new Error("Failed to update membership request");
          }
          
          // Update the object to reflect changes
          membershipRequest.isApproved = true;
          if (adminNotes) membershipRequest.notes = adminNotes;
          
          return NextResponse.json({
            ...membershipRequest.toJSON(),
            message: "Request approved. Member already exists."
          });
        } catch (dbError) {
          console.error("Database error:", dbError);
          throw new Error("Failed to update membership request status");
        }
      }

      // Create new member from request
      const employments = createEmploymentsFromRequest(membershipRequest);

      // Extract skills properly
      console.log("Skills data received:", JSON.stringify(membershipRequest.professionalInfo.skills, null, 2));
      
      // Create proper skills object
      const skillsData = membershipRequest.professionalInfo.skills ? {
        skills: membershipRequest.professionalInfo.skills.skills || '',
        description: membershipRequest.professionalInfo.skills.description || ''
      } : { skills: '', description: '' };
      
      console.log("Prepared skills data:", JSON.stringify(skillsData, null, 2));

      // Extract social media links properly
      console.log("Social data received:", JSON.stringify(membershipRequest.socialPresence, null, 2));
      
      // Create proper social media object with non-null values
      const socialData = {
        linkedInProfile: membershipRequest.socialPresence?.linkedInProfile || '',
        personalWebsite: membershipRequest.socialPresence?.personalWebsite || '',
        instagramProfile: membershipRequest.socialPresence?.instagramProfile || '',
        facebookProfile: membershipRequest.socialPresence?.facebookProfile || '',
        xProfile: membershipRequest.socialPresence?.xProfile || '',
      };
      
      console.log("Prepared social data:", JSON.stringify(socialData, null, 2));

      const newMember = new Member({
        uid: membershipRequest.memberLogin.uid,
        personalDetails: {
          ...membershipRequest.personalDetails,
          // Include parish status if it exists
          ...(membershipRequest.personalDetails.parishStatus && {
            parishStatus: membershipRequest.personalDetails.parishStatus
          })
        },
        contactInformation: membershipRequest.contactInformation,
        employments: employments,
        // Assign skills properly
        skills: skillsData,
        // Assign social media links to both properties
        socialPresence: socialData,
        social: socialData,
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

      // Add additional logging to verify data before saving
      console.log("New member social data:", JSON.stringify({
        socialPresence: newMember.socialPresence,
        social: newMember.social
      }, null, 2));
      console.log("New member skills data:", JSON.stringify(newMember.skills, null, 2));

      try {
        await newMember.save();
        console.log(`Created new member for UID: ${membershipRequest.memberLogin.uid}`);
      } catch (memberError) {
        console.error("Failed to create member:", memberError);
        throw new Error(`Failed to create member: ${memberError instanceof Error ? memberError.message : 'Unknown error'}`);
      }
      
      // Update request status
      try {
        // Get a direct reference to the MongoDB collection
        if (!mongoose.connection || !mongoose.connection.db) {
          throw new Error("Database connection not established");
        }
        const db = mongoose.connection.db;
        const collection = db.collection('membershiprequests');
        
        // Update directly using MongoDB driver
        const updateResult = await collection.updateOne(
          { _id: membershipRequest._id },
          { 
            $set: { 
              isApproved: true,
              notes: adminNotes || membershipRequest.notes 
            } 
          }
        );
        
        if (!updateResult.acknowledged) {
          throw new Error("Failed to update membership request");
        }
        
        // Update the object to reflect changes
        membershipRequest.isApproved = true;
        if (adminNotes) membershipRequest.notes = adminNotes;
      } catch (dbError) {
        console.error("Database error:", dbError);
        throw new Error("Failed to update membership request status");
      }
    } else if (action === 'update') {
      // Soft delete using direct MongoDB update
      try {
        // Get a direct reference to the MongoDB collection
        if (!mongoose.connection || !mongoose.connection.db) {
          throw new Error("Database connection not established");
        }
        const db = mongoose.connection.db;
        const collection = db.collection('membershiprequests');
        
        // Update directly using MongoDB driver
        const updateResult = await collection.updateOne(
          { _id: membershipRequest._id },
          { 
            $set: { 
              softDeleted: true,
              notes: adminNotes || membershipRequest.notes 
            } 
          }
        );
        
        if (!updateResult.acknowledged) {
          throw new Error("Failed to update membership request");
        }
        
        // Update the object to reflect changes
        membershipRequest.softDeleted = true;
        if (adminNotes) membershipRequest.notes = adminNotes;
      } catch (dbError) {
        console.error("Database error:", dbError);
        throw new Error("Failed to update membership request status");
      }
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

// Helper function to create employments array from membership request
function createEmploymentsFromRequest(membershipRequest: any) {
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
  
  // Handle business owner status - support for multiple businesses
  if (statuses.includes('business_owner')) {
    // Check if we have the new businesses array
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
          isActive: true,
          startDate: new Date(),
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
        isActive: true,
        startDate: new Date(),
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
      isActive: true,
      startDate: new Date(),
    });
  }
  
  return employments;
}

export const GET = async (
  request: Request,
  context: { params: tParams }
) => getHandler(request, context);

export const PATCH = async (
  request: Request,
  context: { params: tParams }
) => patchHandler(request, context); 