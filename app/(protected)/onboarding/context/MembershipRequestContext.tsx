/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUserUid } from "@/store/slices/userSlice";
import {
  IMemberLogin,
  IPersonalDetails,
  IContactInformation,
  IProfessionalInfo,
  ISocialPresence,
  IPrivacyConsent,
} from "@/models/MembershipRequest";
import { IVisibility } from "@/models/Member";

export interface MembershipRequestData {
  memberLogin: IMemberLogin;
  personalDetails: IPersonalDetails;
  contactInformation: IContactInformation;
  professionalInfo: IProfessionalInfo;
  socialPresence: ISocialPresence;
  privacyConsent: IPrivacyConsent;
  visibility: IVisibility;
  isApproved: boolean;
  softDeleted?: boolean;
  lastModifiedBy?: string;
}

export const defaultMembershipRequest: MembershipRequestData = {
  memberLogin: { uid: "" },
  personalDetails: { 
    firstName: "", 
    lastName: "", 
    ageRange: "",
    parishStatus: { 
      status: "member" 
    }
  },
  contactInformation: {
    primaryPhoneNumber: "",
    primaryEmail: "",
    address: { line1: "", line2: "", city: "", state: "", zip: "", country: "" },
  },
  professionalInfo: {
    employmentStatus: { status: "" },
    businesses: [],
    skills: {
      skills: "",
      description: ""
    }
  },
  socialPresence: {
    linkedInProfile: "",
    personalWebsite: "",
  },
  privacyConsent: {
    termsAccepted: false,
    privacyPolicyAccepted: false,
    directoryListing: false,
    dataSharing: false,
    internalConsent: false,
    displayInYellowPages: false,
    displayPhonePublicly: false,
  },
  visibility: {
    profile: 'public',
    contact: {
      email: 'private',
      phone: 'private',
      address: 'private',
    },
    employment: {
      current: 'public',
      history: 'private',
    },
    social: 'public',
    phoneNumber: 'private'
  },
  isApproved: false,
  softDeleted: false,
};

interface MembershipRequestContextType {
  membershipData: MembershipRequestData;
  setMembershipData: React.Dispatch<React.SetStateAction<MembershipRequestData>>;
  updatePersonalDetails: (data: Partial<IPersonalDetails>) => void;
  updateContactInformation: (data: Partial<IContactInformation>) => void;
  updateProfessionalInfo: (data: Partial<IProfessionalInfo>) => void;
  updateSocialPresence: (data: Partial<ISocialPresence>) => void;
  updatePrivacyConsent: (data: Partial<IPrivacyConsent>) => void;
  submitMembershipRequest: () => Promise<any>;
  loading: boolean;
}

const MembershipRequestContext = createContext<MembershipRequestContextType | undefined>(undefined);

export const MembershipRequestProvider = ({ children }: { children: ReactNode }) => {
  const userUid = useSelector(selectUserUid) ?? "";
  
  const [membershipData, setMembershipData] = useState<MembershipRequestData>(() => ({
    ...defaultMembershipRequest,
    memberLogin: { uid: userUid },
  }));
  
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setMembershipData(prev => ({
      ...prev,
      memberLogin: { uid: userUid }
    }));
  }, [userUid]);

  const updatePersonalDetails = (data: Partial<IPersonalDetails>) => {
    setMembershipData(prev => ({
      ...prev,
      personalDetails: { ...prev.personalDetails, ...data },
    }));
  };

  const updateContactInformation = (data: Partial<IContactInformation>) => {
    setMembershipData(prev => ({
      ...prev,
      contactInformation: { ...prev.contactInformation, ...data },
    }));
  };

  const updateProfessionalInfo = (data: Partial<IProfessionalInfo>) => {
    setMembershipData(prev => ({
      ...prev,
      professionalInfo: { ...prev.professionalInfo, ...data },
    }));
  };

  const updateSocialPresence = (data: Partial<ISocialPresence>) => {
    setMembershipData(prev => ({
      ...prev,
      socialPresence: { ...prev.socialPresence, ...data },
    }));
  };

  const updatePrivacyConsent = (data: Partial<IPrivacyConsent>) => {
    setMembershipData(prev => ({
      ...prev,
      privacyConsent: { ...prev.privacyConsent, ...data },
    }));
  };

  const submitMembershipRequest = async () => {
    setLoading(true);
    try {
      // Set phoneNumber visibility based on displayPhonePublicly
      const phoneVisibility = membershipData.privacyConsent.displayPhonePublicly ? 'public' : 'private';
      
      // Create a new data object with properly set visibility
      const dataToSubmit = {
        ...membershipData,
        visibility: {
          ...membershipData.visibility,
          contact: {
            ...membershipData.visibility.contact,
            phone: phoneVisibility,  // Set phone visibility in contact
          },
          phoneNumber: phoneVisibility  // Also set the standalone phoneNumber field
        }
      };

      // Check if employment status is missing or invalid
      if (!dataToSubmit.professionalInfo.employmentStatus || 
          !dataToSubmit.professionalInfo.employmentStatus.status ||
          dataToSubmit.professionalInfo.employmentStatus.status.trim() === '') {
        console.log('Employment status is missing or empty');
        throw new Error('Employment status is required. Please go back and select your employment status.');
      }

      // Ensure employment status is a valid string
      if (typeof dataToSubmit.professionalInfo.employmentStatus.status !== 'string') {
        console.error('Employment status has wrong type:', typeof dataToSubmit.professionalInfo.employmentStatus.status);
        dataToSubmit.professionalInfo.employmentStatus.status = String(dataToSubmit.professionalInfo.employmentStatus.status);
      }

      console.log('Employment Status:', JSON.stringify(dataToSubmit.professionalInfo.employmentStatus));

      // Ensure business owner data is properly formatted
      if (dataToSubmit.professionalInfo.employmentStatus.status.includes('business_owner')) {
        console.log('Preparing business_owner data for submission');
        
        // Make sure the businesses array exists and is initialized
        if (!Array.isArray(dataToSubmit.professionalInfo.businesses)) {
          dataToSubmit.professionalInfo.businesses = [];
        }
        
        // If the legacy business field exists but businesses array is empty, convert it
        if (dataToSubmit.professionalInfo.business && 
            dataToSubmit.professionalInfo.businesses.length === 0) {
          console.log('Converting legacy business to array format');
          dataToSubmit.professionalInfo.businesses = [dataToSubmit.professionalInfo.business];
        }
        
        // Validate that each business in the array has the required fields
        const validBusinesses = dataToSubmit.professionalInfo.businesses.filter(b => 
          b && b.businessName && b.industry && b.description
        );
        
        // Only keep valid businesses 
        if (validBusinesses.length > 0) {
          console.log(`Found ${validBusinesses.length} valid businesses out of ${dataToSubmit.professionalInfo.businesses.length}`);
          dataToSubmit.professionalInfo.businesses = validBusinesses;
        } else {
          // No valid businesses found, check if we can use the single business object
          if (dataToSubmit.professionalInfo.business && 
              dataToSubmit.professionalInfo.business.businessName && 
              dataToSubmit.professionalInfo.business.industry && 
              dataToSubmit.professionalInfo.business.description) {
            console.log('Using legacy business object as fallback');
            dataToSubmit.professionalInfo.businesses = [dataToSubmit.professionalInfo.business];
          } else {
            // No valid business data found - this will fail validation, but that's OK as it should
            console.warn('No valid business data found for business_owner status');
            // Leave the businesses array as-is, don't add dummy data
          }
        }
      }

      console.log('Submitting membership request with data:', JSON.stringify(dataToSubmit, null, 2));
      
      const res = await fetch("/api/membership-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSubmit),
      });
      
      const result = await res.json();
      if (!res.ok) {
        let errorMessage = "Submission failed";
        if (result.error) {
          errorMessage = typeof result.error === "object" 
            ? JSON.stringify(result.error) 
            : result.error;
        }
        console.error("Submission failed with status:", res.status, "error:", errorMessage);
        
        // Employment status error detection
        if (errorMessage.includes("employmentStatus") || errorMessage.includes("employment status")) {
          throw new Error("Employment status validation failed. Please go back and select your status.");
        }
        
        // Special handling for professional info errors
        if (errorMessage.includes("professionalInfo")) {
          console.error("Professional info validation error. Data sent:", 
            JSON.stringify(dataToSubmit.professionalInfo, null, 2));
          
          // Surface a clearer error message to the user
          if (dataToSubmit.professionalInfo.employmentStatus.status.includes('business_owner')) {
            throw new Error("Business information is required. Please go back and complete the business details.");
          } else if (dataToSubmit.professionalInfo.employmentStatus.status.includes('employed')) {
            throw new Error("Employment information is required. Please go back and complete your employment details.");
          }
        }
        
        throw new Error(errorMessage);
      }
      console.log("Membership request submitted successfully:", result);
      return result;
    } catch (err) {
      console.error("Error submitting membership request", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <MembershipRequestContext.Provider
      value={{
        membershipData,
        setMembershipData,
        updatePersonalDetails,
        updateContactInformation,
        updateProfessionalInfo,
        updateSocialPresence,
        updatePrivacyConsent,
        submitMembershipRequest,
        loading,
      }}
    >
      {children}
    </MembershipRequestContext.Provider>
  );
};

export const useMembershipRequest = () => {
  const context = useContext(MembershipRequestContext);
  if (!context) {
    throw new Error("useMembershipRequest must be used within a MembershipRequestProvider");
  }
  return context;
};
